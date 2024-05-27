import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import {
  accessTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  verifyForgotPasswordTokenValidator,
} from './middlewares';
import {
  registerController,
  loginController,
  forgotPasswordController,
  verifyForgotPasswordTokenController,
  getMeController,
} from './controllers';

const userRouter = Router();

userRouter.post('/register', registerValidator, wrapAsync(registerController));
userRouter.post('/login', loginValidator, wrapAsync(loginController));
userRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController));
userRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController),
);
userRouter.get('/me', accessTokenValidator, wrapAsync(getMeController));

export default userRouter;
