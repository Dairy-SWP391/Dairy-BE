import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import { roleValidator } from '../user/middlewares';
import { addPostValidator, getPostDetailValidator } from './middlewares';
import { createPostController, getPostDetailController } from './controllers';

const postRouter = Router();

postRouter.post('/add-post', roleValidator, addPostValidator, wrapAsync(createPostController));

postRouter.get('/post-detail/:id', getPostDetailValidator, wrapAsync(getPostDetailController));

export default postRouter;
