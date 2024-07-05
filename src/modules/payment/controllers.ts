import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { GetFeeReqBody } from '../ship/requests';
import orderService from '../order/service';
import shipServices from '../ship/service';
import paymentServices from './service';
import { PaymentResultReqQuery } from './requests';
import { TokenPayload } from '../user/requests';

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
  } = req.body;
  const feeReq = {
    service_id,
    to_district_id,
    to_ward_code,
  };
  const { user_id } = req.decoded_authorization as TokenPayload;
  const cartList = await orderService.convertCartList(cart_list);
  const fee = await shipServices.getFee(feeReq, cartList);
  const totalMoneyNeedPay = cartList.totalMoney + fee.total;
  // vị trí ip mà khách hàng đang giao dịch
  // tạo order cho khách hàng với status là pending - chờ thanh toán
  console.log('cartlist', cartList);
  console.log('fee', fee);
  const order_id = await orderService.createOrder({
    user_id,
    receiver_name,
    phone_number,
    address,
    cartList,
    fee,
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

  res.send(result);
};
