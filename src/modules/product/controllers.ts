import { Request, Response } from 'express';
import productService from './service';
import { PRODUCT_MESSAGES } from './messages';
import productPricingsService from '../product_pricings/service';
import brandService from '../brand/service';
import imageService from '../image/service';
import { ParamsDictionary } from 'express-serve-static-core';
import {
  AddProductBodyReq,
  deleteProductReqBody,
  getProductsByCategorySortAndPaginateBodyReq,
  UpdateProductReqBody,
} from './requests';
import feedbackService from '../feedback/services';

export const getProductDetailController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productService.getProductDetail(Number(id));
  if (!product) {
    return res.status(404).send(PRODUCT_MESSAGES.NOT_FOUND);
  }
  if (product.status === 'INACTIVE') {
    return res.status(404).send(PRODUCT_MESSAGES.NOT_FOUND);
  }
  const prices = await productPricingsService.getProductPrice(Number(id));
  const brand = await brandService.getBrandName(product.brand_id);
  const images = await imageService.getProductImages(Number(id));
  const feedback = await feedbackService.getFeedbackByProductId(Number(id));
  res.status(200).json({
    data: { ...product, ...prices, brand: brand?.name, images: images, feedback: feedback },
    message: PRODUCT_MESSAGES.GET_PRODUCT_DETAIL_SUCCESS,
  });
};

export const getBrandNameController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productService.getProductDetail(Number(id));
  if (!product) {
    return res.status(404).send(PRODUCT_MESSAGES.NOT_FOUND);
  }
  const brand = await brandService.getBrandName(product?.brand_id);
  if (!brand) {
    return res.status(404).send(PRODUCT_MESSAGES.NOT_FOUND);
  }
  res.status(200).json({
    data: brand,
    message: PRODUCT_MESSAGES.GET_BRAND_NAME_SUCCESS,
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

export const getProductsByCategorySortAndPaginateController = async (
  req: Request<ParamsDictionary, any, getProductsByCategorySortAndPaginateBodyReq>,
  res: Response,
) => {
  const result = await productService.getProductByCategorySortingAndPaginate(req.body, 'ACTIVE');
  res.json({
    data: result,
    message: PRODUCT_MESSAGES.GET_PRODUCT_BASED_ON_CATEGORY_SORT_PAGINATION_SUCCESS,
  });
};

export const getProductsByCategorySortAndPaginateAdminController = async (
  req: Request<ParamsDictionary, any, getProductsByCategorySortAndPaginateBodyReq>,
  res: Response,
) => {
  const result = await productService.getProductByCategorySortingAndPaginate(req.body, 'ALL');
  res.json({
    data: result,
    message: PRODUCT_MESSAGES.GET_PRODUCT_BASED_ON_CATEGORY_SORT_PAGINATION_SUCCESS,
  });
};

export const searchProductController = async (req: Request, res: Response) => {
  const { search, num_of_items_per_page, page } = req.query;

  const result = await productService.searchProduct(
    search as string,
    Number(num_of_items_per_page),
    Number(page),
  );

  res.json({ message: PRODUCT_MESSAGES.SEARCH_PRODUCT_SUCCESS, data: result });
};
export const deleteProductController = async (
  req: Request<ParamsDictionary, any, deleteProductReqBody>,
  res: Response,
) => {
  const { id } = req.body;

  const result = await productService.deleteProduct(id);

  return res.json({ message: PRODUCT_MESSAGES.DELETE_PRODUCT_SUCCESS, result: result });
};
export const updateProductController = async (
  req: Request<ParamsDictionary, any, UpdateProductReqBody>,
  res: Response,
) => {
  const result = await productService.updateProduct(req.body);
  return res.json({ message: PRODUCT_MESSAGES.UPDATE_PRODUCT_SUCCESS, ...result });
};
