import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { GetFeeReqBody } from '../ship/requests';
import orderService from '../order/service';
import shipServices from '../ship/service';
import paymentServices from './service';
import { PaymentResultReqQuery } from './requests';
import { TokenPayload } from '../user/requests';
import { DatabaseInstance } from '~/database/database.services';

export const createPaymentController = async (
  req: Request<ParamsDictionary, any, GetFeeReqBody>,
  res: Response,
) => {
  // tính tiền
  const {
    address,
    cart_list,
    phone_number,
    receiver_name,
    service_id,
    to_district_id,
    to_ward_code,
    voucher_code,
  } = req.body;
  const feeReq = {
    service_id,
    to_district_id,
    to_ward_code,
  };
  const { user_id } = req.decoded_authorization as TokenPayload;
  const cartList = await orderService.convertCartList({ cart_list, voucher_code });
  const fee = await shipServices.getFee(feeReq, cartList);
  if (voucher_code) {
    const voucher = await DatabaseInstance.getPrismaInstance().voucher.update({
      where: {
        code: voucher_code,
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    });
    await DatabaseInstance.getPrismaInstance().user.update({
      where: {
        id: user_id,
      },
      data: {
        point: {
          decrement: voucher?.value,
        },
      },
    });
  }

  const totalMoneyNeedPay = cartList.totalMoney + fee.total;
  // vị trí ip mà khách hàng đang giao dịch
  // tạo order cho khách hàng với status là pending - chờ thanh toán
  const order_id = await orderService.createOrder({
    user_id,
    receiver_name,
    phone_number,
    address,
    cartList,
    fee,
    ...feeReq,
  });
  const vnpayURL = await paymentServices.getVnpayUrl(totalMoneyNeedPay, order_id);
  res.send({ vnpayURL });
};

export const checkPaymentResultMiddleware = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
) => {
  const vnpayResponse = req.query as PaymentResultReqQuery;
  const result = await paymentServices.checkPaymentResult(vnpayResponse);
  res.redirect(result);
};
