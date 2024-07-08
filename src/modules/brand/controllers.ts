import { Request, Response } from 'express';
import brandService from './service';
import { BRAND_MESSAGES } from './messages';

export const getAllBrandsController = async (req: Request, res: Response) => {
  const result = await brandService.getAllBrand();
  res.json({
    message: BRAND_MESSAGES.GET_ALL_BRANDS_SUCCESS,
    result: result,
  });
};
