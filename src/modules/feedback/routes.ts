import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import { accessTokenValidator } from '../user/middlewares';
import { feedbackValidator, getFeedbackValidator } from './middlewares';
import { getFeedbackController, giveFeedbackController } from './controllers';

export const feedbackRouter = Router();

feedbackRouter.post(
  '/give-feedback',
  accessTokenValidator,
  feedbackValidator,
  wrapAsync(giveFeedbackController),
);

feedbackRouter.get('/detail-feedback', getFeedbackValidator, wrapAsync(getFeedbackController));

// feedbackRouter.post(
//   '/send-feekback',
//   accessTokenValidator,
//   sendFeedbackValidator,
//   wrapAsync(sendFeedbackController),
// );

export default feedbackRouter;
