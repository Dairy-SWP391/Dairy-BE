import { Request, Response } from 'express';
import orderService from './service';
import { ORDER_MESSAGES } from './messages';
import { TokenPayload } from '../user/requests';
import { CancelOrderRequestBody } from './requests';

export const getOrderInfoController = async (req: Request, res: Response) => {
  const order_id = req.params.order_id;

  const result = await orderService.getOrderDetailById(order_id);

  res.json({
    message: ORDER_MESSAGES.GET_ORDER_DETAIL_SUCCESS,
    data: result,
  });
};

export const getAllOrdersController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;

  const result = await orderService.getAllOrders(user_id);

  res.json({
    message: ORDER_MESSAGES.GET_ALL_ORDERS_SUCCESS,
    data: result,
  });
};

export const getOrderReportController = async (req: Request, res: Response) => {
  const result = await orderService.getOrderReport();
  res.json({
    message: ORDER_MESSAGES.GET_ORDER_REPORT_SUCCESS,
    data: result,
  });
};

export const cancelOrderController = async (
  req: Request<any, any, CancelOrderRequestBody>,
  res: Response,
) => {
  const { cancel_reason, order_id } = req.body;
  await orderService.cancelOrder({ order_id, cancel_reason });
  res.json({
    message: ORDER_MESSAGES.CANCEL_ORDER_SUCCESS,
  });
};

export const deliverSuccessController = async (req: Request, res: Response) => {
  const { order_id } = req.query;
  await orderService.deliverSuccess(Number(order_id));
  return res.json({
    message: ORDER_MESSAGES.DELIVER_SUCCESS,
  });
};

// export const refundOrderController = async (req: Request, res: Response) => {};
