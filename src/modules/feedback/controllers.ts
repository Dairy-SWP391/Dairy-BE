import { Request, Response } from 'express';
import feedbackService from './services';
import { ParamsDictionary } from 'express-serve-static-core';
import { GiveFeedbackBodyReq, SendFeedbackReqBody } from './requests';
import { FEEDBACK_MESSAGES } from './messages';
import orderDetailService from '../orderDetail/service';
import { TokenPayload } from '../user/requests';

export const giveFeedbackController = async (
  req: Request<ParamsDictionary, any, GiveFeedbackBodyReq>,
  res: Response,
) => {
  const { order_detail_id, content, rating_point } = req.body;
  const user_id = req.decoded_authorization.user_id;

  const feedback = await feedbackService.createFeedback({
    user_id,
    order_detail_id,
    content,
    rating_point,
  });
  res.json({ message: FEEDBACK_MESSAGES.FEEDBACK_CREATED_SUCCESSFULLY, result: feedback });
};

export const getFeedbackController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
) => {
  const { product_id } = req.query;
  const feedbacks = await feedbackService.getFeedbackByProductId(Number(product_id));
  return res.json({ message: FEEDBACK_MESSAGES.GET_FEEDBACK_SUCCESSFULLy, result: feedbacks });
};

export const sendFeedbackController = async (
  req: Request<any, any, SendFeedbackReqBody>,
  res: Response,
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { product_id } = req.body;
  const order_detail = await orderDetailService.getOrderDetailById(user_id, Number(product_id));
  if (!order_detail) {
    return res.status(404).json({ message: FEEDBACK_MESSAGES.ORDER_DETAIL_NOT_FOUND });
  }
  const result = await feedbackService.sendFeedback({
    ...req.body,
    user_id,
    order_detail_id: order_detail.id,
  });
  return res.json({ message: FEEDBACK_MESSAGES.FEEDBACK_CREATED_SUCCESSFULLY, result });
};
