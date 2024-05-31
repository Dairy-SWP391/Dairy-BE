import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import { addProductController, getProductDetailController } from './controllers';
import { roleValidator, addProductValidator } from './middlewares';

const productRouter = Router();
productRouter.get(
  '/add-product',
  roleValidator,
  addProductValidator,
  wrapAsync(addProductController),
);
productRouter.get('/:id', wrapAsync(getProductDetailController));

export default productRouter;
