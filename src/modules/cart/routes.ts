import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import { memberValidator } from '../user/middlewares';
import { getCartValidator } from './middlewares';
import { getCartController } from './controllers';

const cartRouter = Router();

cartRouter.post('/cart', memberValidator, getCartValidator, wrapAsync(getCartController));

export default cartRouter;
