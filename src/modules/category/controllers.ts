import { Request, Response } from 'express';
import categoryService from './service';
import { CATEGORY_MESSAGES } from './messages';
import { Category } from './schema';
import { stringToNomalCase } from '~/utils/conveter';

export const GetAllCategoriesController = async (req: Request, res: Response) => {
  const data = await categoryService.getAllCategories();
  const result: Category[] = [];
  data.forEach((category) => {
    if (category.parent_category_id === null) {
      result.push({
        id: category.id,
        name: category.name,
        path: stringToNomalCase(category.name),
        child_category: [],
      });
    } else {
      const parentCategory = result.find((parent) => parent.id === category.parent_category_id);
      parentCategory?.child_category?.push({
        ...category,
        path: stringToNomalCase(category.name),
      });
    }
  });
  res.status(200).json({
    data: result,
    message: CATEGORY_MESSAGES.GET_ALL_CATEGORIES_SUCCESS,
  });
};
