import { Request, Response } from 'express';
import { ForgotPasswordReqBody, LoginRequestBody, RegisterReqBody } from './requests';
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
export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response,
) => {
  const { id, status } = req.user as User;

  const result = await userService.forgotPassword({ user_id: id, verify: status });
  return res.json({
    message: USER_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD,
    result: result,
  });
};
export const verifyForgotPasswordTokenController = async (req: Request, res: Response) => {
  return res.json({ message: USER_MESSAGES.VERIFY_TOKEN_SUCCESSFULLY });
};
