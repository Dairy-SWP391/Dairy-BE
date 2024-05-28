import { Request, Response } from 'express';
import categoryService from './service';
import { CATEGORY_MESSAGES } from './messages';
import { Category } from './schema';

export const GetAllCategoriesController = async (req: Request, res: Response) => {
  const data = await categoryService.getAllCategories();
  const result: Category[] = [];
  data.forEach((category) => {
    if (category.parent_category_id === null) {
      result.push({ ...category, child_category: [] });
    } else {
      const parentCategory = result.find((parent) => parent.id === category.parent_category_id);
      parentCategory?.child_category?.push(category);
    }
  });
  res.status(200).json({
    data: result,
    message: CATEGORY_MESSAGES.GET_ALL_CATEGORIES_SUCCESS,
  });
};
