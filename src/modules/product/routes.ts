import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import {
  addProductController,
  getProductsByCategorySortAndPaginateController,
  getProductDetailController,
  searchProductController,
  addProductToWishListController,
} from './controllers';
import {
  roleValidator,
  addProductValidator,
  getProductsByCategorySortAndPaginateValidator,
  searchProductValidator,
  addProductToWishListValidator,
  memberValidator,
} from './middlewares';

const productRouter = Router();
productRouter.get(
  '/add-product',
  roleValidator,
  addProductValidator,
  wrapAsync(addProductController),
);
productRouter.post(
  '/get-product',
  getProductsByCategorySortAndPaginateValidator,
  wrapAsync(getProductsByCategorySortAndPaginateController),
);
productRouter.get('/search-product', searchProductValidator, wrapAsync(searchProductController));
productRouter.get(
  '/add-wishlist',
  memberValidator,
  addProductToWishListValidator,
  wrapAsync(addProductToWishListController),
);

productRouter.get('/:id', wrapAsync(getProductDetailController));

export default productRouter;
