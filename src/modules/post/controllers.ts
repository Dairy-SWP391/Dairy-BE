import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { AddPostReqBody } from './requests';
import postService from './service';
import { POST_MESSAGES } from './messages';
export const createPostController = async (
  req: Request<ParamsDictionary, any, AddPostReqBody>,
  res: Response,
) => {
  const result = await postService.createPost(req.body);
  res.json({
    message: POST_MESSAGES.POST_CREATED_SUCCESSFULLY,
    result,
  });
};
