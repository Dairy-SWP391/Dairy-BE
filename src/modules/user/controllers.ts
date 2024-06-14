import { Request, Response } from 'express';
import {
  ForgotPasswordReqBody,
  LoginRequestBody,
  RegisterReqBody,
  TokenPayload,
  UpdateMeReqBody,
} from './requests';
import { ParamsDictionary } from 'express-serve-static-core';
import userService from './service';
import { USER_MESSAGES } from './messages';
import { USER_STATUS, User } from '@prisma/client';
import refreshTokenService from '../refreshToken/service';
import { REFRESH_TOKEN_MESSAGES } from '../refreshToken/messages';
import { RefreshTokenReq } from '../refreshToken/requests';

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

export const oAuthController = async (req: Request, res: Response) => {
  const { code } = req.query;

  const { access_token, refresh_token, new_user } = await userService.oAuth(code as string);

  const url = `${process.env.CLIENT_REDIRECT_CALLBACK}?access_token=${access_token}&refresh_token=${refresh_token}&new_user=${new_user}`;

  res.redirect(url);
};

export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const result = await userService.getMe(user_id);
  return res.status(200).json({
    message: USER_MESSAGES.GET_ME_SUCCESS,
    result: result,
  });
};
export const resetPasswordController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload;
  const { password } = req.body;
  const result = await userService.resetPassword(user_id, password);
  return res.json({
    message: USER_MESSAGES.RESET_PASSWORD_SUCCESSFULLY,
    result: result,
  });
};
export const updateMeController = async (
  req: Request<ParamsDictionary, any, UpdateMeReqBody>,
  res: Response,
) => {
  const { user_id } = req.decoded_authorization;
  const result = await userService.updateMe(user_id, req.body);
  return res.json({
    message: USER_MESSAGES.UPDATE_ME_SUCCESS,
    result: result,
  });
};

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReq>,
  res: Response,
) => {
  const { refresh_token } = req.body;
  const { user_id, verify, exp } = req.decoded_refresh_token as TokenPayload;

  const result = await refreshTokenService.refreshToken({
    user_id,
    refresh_token,
    verify,
    exp,
  });
  return res.json({
    message: REFRESH_TOKEN_MESSAGES.REFRESH_TOKEN_SUCCESS,
    result,
  });
};
export const accessTokenController = async (req: Request, res: Response) => {
  console.log(req.decoded_authorization);
  const { user_id, verify } = req.decoded_refresh_token as TokenPayload;
  console.log(user_id, verify);
  const result = await userService.getAccessToken(user_id, verify);
  return res.json({
    message: USER_MESSAGES.GET_ACCESS_TOKEN_SUCCESS,
    result,
  });
};
