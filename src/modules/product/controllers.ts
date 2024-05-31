import { Request, Response } from 'express';
import productService from './service';
import { PRODUCT_MESSAGES } from './messages';
import productPricingsService from '../product_pricings/service';
import { ParamsDictionary } from 'express-serve-static-core';
import { AddProductBodyReq } from './requests';

export const getProductDetailController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productService.getProductDetail(Number(id));
  if (!product) {
    return res.status(404).send(PRODUCT_MESSAGES.NOT_FOUND);
  }
  const prices = await productPricingsService.getProductPrice(Number(id));

  res.status(200).json({
    data: { ...product, ...prices },
    message: PRODUCT_MESSAGES.GET_PRODUCT_DETAIL_SUCCESS,
  });
};
export const addProductController = async (
  req: Request<ParamsDictionary, any, AddProductBodyReq>,
  res: Response,
) => {
  const result = await productService.addProduct(req.body);
  res.json({
    message: PRODUCT_MESSAGES.ADD_PRODUCT_SUCCESS,
    result: result,
  });
};
