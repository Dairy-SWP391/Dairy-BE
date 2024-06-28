import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { GetFeeReqBody } from '../ship/requests';
import orderService from '../order/service';
import shipServices from '../ship/service';
import { omit } from 'lodash';
import paymentServices from './service';
import { PaymentResultReqQuery } from './requests';

export const createPaymentController = async (
  req: Request<ParamsDictionary, any, GetFeeReqBody>,
  res: Response,
) => {
  // tính tiền
  const feeReq = omit(req.body, ['cart_list']);
  const cart_list = req.body.cart_list;
  const cartList = await orderService.convertCartList(cart_list);
  const fee = await shipServices.getFee(feeReq, cartList);
  const totalMoneyNeedPay = cartList.totalMoney + fee.total;
  // vị trí ip mà khách hàng đang giao dịch
  const vnpayURL = await paymentServices.getVnpayUrl(totalMoneyNeedPay);
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
