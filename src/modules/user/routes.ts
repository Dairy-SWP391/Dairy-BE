import { Request, Response, Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import { registerController } from './controllers';
import { registerValidator } from './middlewares';

const userRouter = Router();

userRouter.post('/register', registerValidator, wrapAsync(registerController));

export default userRouter;
