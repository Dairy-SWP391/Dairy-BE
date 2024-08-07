import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import {
  addProductController,
  getProductsByCategorySortAndPaginateController,
  getProductDetailController,
  searchProductController,
  deleteProductController,
  updateProductController,
} from './controllers';
import {
  roleValidator,
  addProductValidator,
  getProductsByCategorySortAndPaginateValidator,
  searchProductValidator,
  deleteProductValidator,
  updateProductValidator,
  priceValidator,
} from './middlewares';

const productRouter = Router();
productRouter.post(
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

productRouter.delete(
  '/delete',
  roleValidator,
  deleteProductValidator,
  wrapAsync(deleteProductController),
);

productRouter.patch(
  '/me',
  roleValidator,
  updateProductValidator,
  priceValidator,
  wrapAsync(updateProductController),
);

productRouter.get('/:id', wrapAsync(getProductDetailController));

export default productRouter;
