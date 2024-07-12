import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import { getAllOrdersController, getOrderInfoController } from './controllers';
import { accessTokenValidator } from '../user/middlewares';
import { getOrderDetailValidator } from './middlewares';

const orderRouter = Router();

orderRouter.get(
  '/detail/:order_id',
  accessTokenValidator,
  getOrderDetailValidator,
  wrapAsync(getOrderInfoController),
);

orderRouter.get('/all', accessTokenValidator, wrapAsync(getAllOrdersController));

export default orderRouter;
