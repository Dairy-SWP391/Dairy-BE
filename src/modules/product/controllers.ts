import { Request, Response } from 'express';
import productService from './service';
import { PRODUCT_MESSAGES } from './messages';
import productPricingsService from '../product_pricings/service';
import brandService from '../brand/service';
import imageService from '../image/service';

export const getProductDetailController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productService.getProductDetail(Number(id));
  if (!product) {
    return res.status(404).send(PRODUCT_MESSAGES.NOT_FOUND);
  }
  const prices = await productPricingsService.getProductPrice(Number(id));
  const brand = await brandService.getBrandName(product.brand_id);
  const images = await imageService.getProductImages(Number(id));

  res.status(200).json({
    data: { ...product, ...prices, brand: brand?.name, images: images },
    message: PRODUCT_MESSAGES.GET_PRODUCT_DETAIL_SUCCESS,
  });
};
