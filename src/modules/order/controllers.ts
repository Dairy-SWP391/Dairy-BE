import { Request, Response } from 'express';
import orderService from './service';
import { ORDER_MESSAGES } from './messages';
import { TokenPayload } from '../user/requests';

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
