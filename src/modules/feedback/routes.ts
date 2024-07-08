import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import { accessTokenValidator } from '../user/middlewares';
import { feedbackValidator } from './middlewares';
import { giveFeedbackController } from './controllers';
export const feedbackRouter = Router();
feedbackRouter.post(
  '/give-feedback',
  accessTokenValidator,
  feedbackValidator,
  wrapAsync(giveFeedbackController),
);
export default feedbackRouter;
