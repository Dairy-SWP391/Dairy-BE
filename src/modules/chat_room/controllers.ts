import { Request, Response } from 'express';
import { TokenPayload } from '../user/requests';
import chatRoomService from './service';
import chatLineService from '../chat_line/service';

export const getMyConversationController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { limit, page } = req.query;
  const chatRoomId = await chatRoomService.getChatRoomByUserId(user_id);
  const result = await chatLineService.getChatByUserIds({
    chat_room_id: chatRoomId,
    limit: Number.parseInt(limit as string),
    page: Number.parseInt(page as string),
  });
  return res.json({
    message: 'Get conversations successfully',
    result: {
      ...result,
      limit: Number(limit),
      page: Number(page),
      total_page: Math.ceil(result.total / Number(limit)),
    },
  });
};

export const getUserConversationController = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const { limit, page } = req.query;
  const chatRoomId = await chatRoomService.getChatRoomByUserId(user_id);
  const result = await chatLineService.getChatByUserIds({
    chat_room_id: chatRoomId,
    limit: Number.parseInt(limit as string),
    page: Number.parseInt(page as string),
  });
  return res.json({
    message: 'Get conversations successfully',
    result: {
      ...result,
      limit: Number(limit),
      page: Number(page),
      total_page: Math.ceil(result.total / Number(limit)),
    },
  });
};
