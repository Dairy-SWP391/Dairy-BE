import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import { roleValidator } from '../user/middlewares';
import { addPostValidator } from './middlewares';
import { createPostController } from './controllers';
const postRouter = Router();
postRouter.post('/add-post', roleValidator, addPostValidator, wrapAsync(createPostController));
export default postRouter;
