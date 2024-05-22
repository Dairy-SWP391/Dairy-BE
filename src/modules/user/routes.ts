import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import { forgotPasswordValidator, loginValidator, registerValidator } from './middlewares';
import { registerController, loginController, forgotPasswordController } from './controllers';

const userRouter = Router();

userRouter.post('/register', registerValidator, wrapAsync(registerController));
userRouter.post('/login', loginValidator, wrapAsync(loginController));
userRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController));

export default userRouter;
