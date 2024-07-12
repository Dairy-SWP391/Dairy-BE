import { NextFunction, Request, Response } from 'express';
// import { checkSchema } from 'express-validator';
// import { validate } from '~/utils/validation';

import { ParamsDictionary } from 'express-serve-static-core';
import HTTP_STATUS from '~/constants/httpsStatus';
import { ErrorWithStatus } from '../error/entityError';
import { ORDER_MESSAGES } from './messages';
import { GetFeeReqBody } from '../ship/requests';
import { validate } from '~/utils/validation';
import { checkSchema } from 'express-validator';
import { DatabaseInstance } from '~/database/database.services';

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

export const getOrderDetailValidator = validate(
  checkSchema({
    order_id: {
      notEmpty: {
        errorMessage: ORDER_MESSAGES.ORDER_ID_IS_REQUIRED,
      },
      isNumeric: {
        errorMessage: ORDER_MESSAGES.ORDER_ID_MUST_BE_NUMBER,
      },
      custom: {
        options: async (value) => {
          const order = await DatabaseInstance.getPrismaInstance().order.findUnique({
            where: {
              id: Number(value),
            },
          });
          if (!order) {
            throw new Error(ORDER_MESSAGES.ORDER_ID_IS_INVALID);
          }
          return true;
        },
      },
    },
  }),
);
