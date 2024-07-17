import { config } from 'dotenv';
import { format } from 'date-fns';
import { vnpCreateParams } from './schema';
import qs from 'qs';
import crypto from 'crypto';
import { PaymentResultReqQuery } from './requests';
import { omit } from 'lodash';
import { ErrorWithStatus } from '../error/entityError';
import { PAY_MESSAGE } from './messages';
import HTTP_STATUS from '~/constants/httpsStatus';
import orderService from '../order/service';
import transactionService from '../transaction/service';
import orderDetailService from '../orderDetail/service';
import shipServices from '../ship/service';
import { CartListType } from '../order/schema';
import { CreateOrderParams } from '../ship/schema';
import { DatabaseInstance } from '~/database/database.services';

config();
class PaymentServices {
  async getVnpayUrl(totalMoneyNeedPay: number, order_id: number) {
    const ipAddr = '13.160.92.202';

    const tmnCode = process.env.VNP_TMNCODE as string;
    const secretKey = process.env.VNP_HASHSECRET as string;
    const vnpUrl = process.env.VNP_URL as string;
    const returnUrl = process.env.VNP_RETURN_URL as string;

    const date = new Date();
    date.setHours(date.getHours() + 7);
    const createDate = format(date, 'yyyyMMddHHmmss');
    const orderId = order_id.toString();
    const bankCode = `VNBANK`;
    const amount = totalMoneyNeedPay;
    const orderInfo = `MEVABESHOP PAYMENT ${orderId}`;
    const orderType = `007`; // 007 - Thực phẩm & Đồ uống
    const locale = 'vn';
    const currCode = 'VND';

    const vnp_Params: vnpCreateParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: orderType,
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_BankCode: bankCode,
    };
    const vnp_ParamsSorted = this.sortObject(vnp_Params);
    const signData = qs.stringify(vnp_ParamsSorted, { encode: false });

    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf8')).digest('hex');
    const vnpayURL =
      vnpUrl +
      '?' +
      qs.stringify({ ...vnp_ParamsSorted, vnp_SecureHash: signed }, { encode: false });
    return vnpayURL;
  }

  private sortObject(obj: any) {
    const sorted: { [key: string]: string } = {};
    const str = [];
    let key;
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

  async checkPaymentResult(vnpayResponse: PaymentResultReqQuery) {
    const secureHash = vnpayResponse.vnp_SecureHash;
    const vnpayResponseNew = omit(vnpayResponse, ['vnp_SecureHash', 'vnp_SecureHashType']);
    // mã hóa lại lần nửa để so sánh xem có giống với cái nhận đc không
    const secretKey = process.env.VNP_HASHSECRET as string;
    const vnp_ParamsSorted = this.sortObject(vnpayResponseNew);
    const signData = qs.stringify(vnp_ParamsSorted, { encode: false });

    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf8')).digest('hex');

    if (secureHash === signed) {
      if (vnpayResponseNew.vnp_TransactionStatus === '00') {
        // trong vnpayResponseNew có toàn bộ thông tin giao dịch
        // xử lý logic ở đây
        // chuyển trạng thái order thành success
        const order = await orderService.finishOrderPayment(vnpayResponseNew.vnp_TxnRef as string);
        // lưu lại transaction
        await transactionService.createTransaction(vnpayResponseNew);
        // đặt đơn trên ghn
        // lấy ra chi tiết từng sản phẩm trong order detail
        const cart_list = await orderDetailService.getOrderDetail(order.id);
        const cartList = await orderService.convertCartList({ cart_list });
        const fee = await shipServices.getFee(
          {
            service_id: order.service_id.toString(),
            to_district_id: order.to_district_id.toString(),
            to_ward_code: order.to_ward_code.toString(),
          },
          cartList,
        );
        const createOrderParam = {
          userId: order.user_id,
          fee,
          cartList: cartList as CartListType,
          service_id: order.service_id.toString(),
          to_district_id: order.to_district_id.toString(),
          to_ward_code: order.to_ward_code.toString(),
          address: order.address,
          phone_number: order.phone_number,
          content: '',
          receiver_name: order.receiver_name,
        } as CreateOrderParams;
        const orderGHN = await shipServices.createOrder(createOrderParam);
        await DatabaseInstance.getPrismaInstance().order.update({
          where: {
            id: order.id,
          },
          data: {
            order_ghn_code: orderGHN.data.order_code as string,
            expected_delivery_time: orderGHN.data.expected_delivery_time.toString(),
          },
        });

        await DatabaseInstance.getPrismaInstance().user.update({
          where: {
            id: order.user_id,
          },
          data: {
            point: Number.parseInt((order.end_price * 0.01).toString()),
          },
        });
        // return url để redirect về trang thông tin order của đơn hàng
        const checkout_return_url = process.env.CHECKOUT_RETURN_URL;
        const urlOrderStatus = `${checkout_return_url}?&order_id=${order.id}`;
        return urlOrderStatus;
      }
    }
    throw new ErrorWithStatus({
      message: PAY_MESSAGE.RETURN_URL_IS_INVALID,
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }
}

const paymentServices = new PaymentServices();
export default paymentServices;
