import { Request, Response } from 'express';
import feedbackService from './services';
import { ParamsDictionary } from 'express-serve-static-core';
import { GiveFeedbackBodyReq } from './requests';
import { FEEDBACK_MESSAGES } from './messages';

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
