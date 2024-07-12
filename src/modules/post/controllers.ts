import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { AddPostReqBody } from './requests';
import postService from './service';
import { POST_MESSAGES } from './messages';
import { TokenPayload } from '../user/requests';

export const createPostController = async (
  req: Request<ParamsDictionary, any, AddPostReqBody>,
  res: Response,
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const result = await postService.createPost(req.body, user_id);
  res.json({
    message: POST_MESSAGES.POST_CREATED_SUCCESSFULLY,
    result,
  });
};

export const getPostDetailController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await postService.getPostDetail(id);
  res.json({
    message: POST_MESSAGES.GET_POST_DETAIL_SUCCESS,
    result,
  });
};
