import { NextFunction, Request, Response } from 'express';
// import { checkSchema } from 'express-validator';
// import { validate } from '~/utils/validation';

import { ParamsDictionary } from 'express-serve-static-core';
import HTTP_STATUS from '~/constants/httpsStatus';
import { ErrorWithStatus } from '../error/entityError';
import { ORDER_MESSAGES } from './messages';
import { GetFeeReqBody } from '../ship/requests';

export const checkCartValidMiddleware = async (
  req: Request<ParamsDictionary, any, GetFeeReqBody>,
  res: Response,
  next: NextFunction,
) => {
  const cart_list = req.body.cart_list;
  // kiểm tra xem cart_list gữi lên có phải dạng mảng không
  if (!Array.isArray(cart_list)) {
    throw new ErrorWithStatus({
      message: ORDER_MESSAGES.CART_LIST_IS_INVALID,
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    });
  }
  // kiểm tra xem product_id và quantity có phải là số không
  const isValid = cart_list.every(({ product_id, quantity }) => {
    return !isNaN(Number(product_id)) && !isNaN(Number(quantity));
  });
  if (!isValid) {
    throw new ErrorWithStatus({
      message: ORDER_MESSAGES.PRODUCT_ID_OR_QUANTITY_MUST_BE_NUMBER,
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    });
  }
  next();
};
