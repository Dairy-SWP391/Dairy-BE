import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import { registerController, loginController } from './controllers';
import { loginValidator, registerValidator } from './middlewares';

const userRouter = Router();

userRouter.post('/register', registerValidator, wrapAsync(registerController));
userRouter.post('/login', loginValidator, wrapAsync(loginController));
export default userRouter;
