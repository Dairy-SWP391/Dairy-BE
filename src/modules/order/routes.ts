import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import {
  cancelOrderController,
  deliverSuccessController,
  getAllOrdersController,
  getOrderInfoController,
  getOrderReportController,
} from './controllers';
import { accessTokenValidator, roleValidator } from '../user/middlewares';
import { cancelOrderValidator, getOrderDetailValidator } from './middlewares';

const orderRouter = Router();

orderRouter.get(
  '/detail/:order_id',
  accessTokenValidator,
  getOrderDetailValidator,
  wrapAsync(getOrderInfoController),
);

orderRouter.get('/all', accessTokenValidator, wrapAsync(getAllOrdersController));

orderRouter.get(
  '/order-report',
  accessTokenValidator,
  roleValidator,
  wrapAsync(getOrderReportController),
);

orderRouter.post(
  '/cancel',
  accessTokenValidator,
  roleValidator,
  cancelOrderValidator,
  wrapAsync(cancelOrderController),
);

orderRouter.post('/deliver-success', wrapAsync(deliverSuccessController));

// orderRouter.post('/refund', wrapAsync(refundOrderController));

export default orderRouter;
