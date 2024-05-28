import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import { getProductDetailController } from './controllers';

const productRouter = Router();

productRouter.get('/:id', wrapAsync(getProductDetailController));

export default productRouter;
