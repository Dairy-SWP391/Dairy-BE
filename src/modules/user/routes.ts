import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import {
  accessTokenValidator,
  addAddressValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifyForgotPasswordTokenValidator,
} from './middlewares';
import {
  registerController,
  loginController,
  forgotPasswordController,
  verifyForgotPasswordTokenController,
  oAuthController,
  getMeController,
  resetPasswordController,
  updateMeController,
  accessTokenController,
  addAddressController,
} from './controllers';
import { refreshTokenController } from './controllers';

const userRouter = Router();

userRouter.post('/register', registerValidator, wrapAsync(registerController));
userRouter.post('/login', loginValidator, wrapAsync(loginController));
userRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController));
userRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController),
);
userRouter.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  wrapAsync(resetPasswordController),
);
userRouter.get('/oauth/google', wrapAsync(oAuthController));
userRouter.get('/me', accessTokenValidator, wrapAsync(getMeController));
userRouter.patch('/me', accessTokenValidator, updateMeValidator, wrapAsync(updateMeController));
userRouter.post('/refresh-token', refreshTokenValidator, wrapAsync(refreshTokenController));
userRouter.get('/access-token', refreshTokenValidator, wrapAsync(accessTokenController));

userRouter.get(
  '/add-address',
  accessTokenValidator,
  addAddressValidator,
  wrapAsync(addAddressController),
);
export default userRouter;
