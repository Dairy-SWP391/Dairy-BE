import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { CartItemReqBody } from './schema';
import cartService from './services';
import { CART_MESSAGES } from './messages';

export const getCartController = async (
  req: Request<ParamsDictionary, any, CartItemReqBody[]>,
  res: Response,
) => {
  const result = await cartService.getCart(req.body);
  res.json({
    message: CART_MESSAGES.GET_CART_SUCCESS,
    result: result,
  });
};
