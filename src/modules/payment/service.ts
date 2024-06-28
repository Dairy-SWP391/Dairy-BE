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
config();
class PaymentServices {
  async getVnpayUrl(totalMoneyNeedPay: number) {
    const ipAddr = '13.160.92.202';

    const tmnCode = process.env.VNP_TMNCODE as string;
    const secretKey = process.env.VNP_HASHSECRET as string;
    const vnpUrl = process.env.VNP_URL as string;
    const returnUrl = process.env.VNP_RETURN_URL as string;

    const date = new Date();
    date.setHours(date.getHours() + 7);
    const createDate = format(date, 'yyyyMMddHHmmss');
    const orderId = format(date, 'HHmmss');
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
        // đặt đơn trên ghn
        // tạo order trong db, lấy cái order_id
        // lưu lại transaction
        // return url để redirect về trang thông tin order của đơn hàng
        const urlOrderStatus = 'https://mevabeshop.com/order/order_id';
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
