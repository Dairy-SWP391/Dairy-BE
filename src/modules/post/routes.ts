import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import { roleValidator } from '../user/middlewares';
import { addPostValidator, getPostDetailValidator } from './middlewares';
import { createPostController, getAllPostController, getPostDetailController } from './controllers';
import { paginationValidator } from '../chat_room/middlewares';

const postRouter = Router();

postRouter.post('/add-post', roleValidator, addPostValidator, wrapAsync(createPostController));

postRouter.get('/post-detail/:id', getPostDetailValidator, wrapAsync(getPostDetailController));

postRouter.get('/all', paginationValidator, wrapAsync(getAllPostController));

export default postRouter;
