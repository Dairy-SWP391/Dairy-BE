import { Router } from 'express';
import { accessTokenValidator, roleValidator } from '../user/middlewares';
import { getMyConversationController, getUserConversationController } from './controllers';
import { wrapAsync } from '~/utils/handler';
import { getConversationValidator, paginationValidator } from './middlewares';

const chatRoomRouter = Router();

/*
des: lấy tin nhắn của mình
method: GET
path: /conversations/me
query: limit: number, page: number //phân trang tin nhắn
headers: {Authorization: Bearer <accessToken>} để biết mình là ai
*/
chatRoomRouter.get(
  '/me',
  accessTokenValidator,
  paginationValidator,
  wrapAsync(getMyConversationController),
);

chatRoomRouter.get(
  '/user/:user_id',
  accessTokenValidator,
  roleValidator,
  getConversationValidator,
  paginationValidator,
  wrapAsync(getUserConversationController),
);

export default chatRoomRouter;
