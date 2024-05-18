import { Request, Response } from 'express';
import { LoginRequestBody, RegisterReqBody } from './requests';
import { ParamsDictionary } from 'express-serve-static-core';
import userService from './service';
import { USER_MESSAGES } from './messages';
import { USER_STATUS, User } from '@prisma/client';
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
) => {
  const user = await userService.register(req.body);
  res.json({
    message: USER_MESSAGES.REGISTER_SUCCESS,
    data: user,
  });
};

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginRequestBody>,
  res: Response,
) => {
  const user = req.user as User;
  const user_id = user.id as string;
  const result = await userService.login({ user_id: user_id, verify: user.status as USER_STATUS });
  return res.status(200).json({
    message: USER_MESSAGES.LOGIN_SUCCESS,
    result: result,
  });
};
