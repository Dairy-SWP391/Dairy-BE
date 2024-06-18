import { ParamSchema, checkSchema } from 'express-validator';
import { USER_MESSAGES } from './messages';
import { validate } from '~/utils/validation';
import userService from './service';
import { hashPassword } from '~/utils/crypto';
import { DatabaseInstance } from '~/database/database.services';
import { verifyToken } from '~/utils/jwt';
import { ErrorWithStatus } from '../error/entityError';
import { JsonWebTokenError } from 'jsonwebtoken';
import HTTP_STATUS from '~/constants/httpsStatus';
import { TokenPayload } from './requests';
import { Request } from 'express';

export const emailSchema: ParamSchema = {
  trim: true,
  isEmail: {
    errorMessage: USER_MESSAGES.EMAIL_IS_INVALID,
  },
  notEmpty: {
    errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED,
  },
};

export const phone_numberSchema: ParamSchema = {
  optional: {
    options: {
      nullable: true,
    },
  },
  trim: true,
  isString: {
    errorMessage: USER_MESSAGES.PHONE_NUMBER_MUST_BE_STRING,
  },
  isMobilePhone: {
    options: ['vi-VN'],
    errorMessage: USER_MESSAGES.PHONE_NUMBER_IS_INVALID,
  },
};

const passwordSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED,
  },
  isString: {
    errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_STRING,
  },
  isStrongPassword: {
    options: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_STRONG,
  },
};

const firstnameSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: USER_MESSAGES.FIRST_NAME_IS_REQUIRED,
  },
  isString: {
    errorMessage: USER_MESSAGES.FIRST_NAME_MUST_BE_STRING,
  },
  isLength: {
    options: {
      min: 1,
      max: 50,
    },
    errorMessage: USER_MESSAGES.FIRST_NAME_LENGTH_MUST_BE_FROM_1_TO_50,
  },
};

const lastnameSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: USER_MESSAGES.LAST_NAME_IS_REQUIRED,
  },
  isString: {
    errorMessage: USER_MESSAGES.LAST_NAME_MUST_BE_STRING,
  },
  isLength: {
    options: {
      min: 1,
      max: 50,
    },
    errorMessage: USER_MESSAGES.LAST_NAME_LENGTH_MUST_BE_FROM_1_TO_50,
  },
};

const imageSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USER_MESSAGES.IMAGE_URL_MUST_BE_A_STRING,
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 400,
    },
    errorMessage: USER_MESSAGES.IMAGE_URL_LENGTH_MUST_BE_FROM_1_TO_400,
  },
};
const confirmPasswordSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED,
  },
  isString: {
    errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRING,
  },
  isStrongPassword: {
    options: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG,
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(USER_MESSAGES.CONFIRM_PASSWORD_MUST_MATCH_PASSWORD);
      }
      return true;
    },
  },
};
const addressSchema: ParamSchema = {
  isString: {
    errorMessage: USER_MESSAGES.ADDRESS_MUST_BE_STRING,
  },
  trim: true,
  optional: true,
  notEmpty: undefined,
};

export const registerValidator = validate(
  checkSchema(
    {
      first_name: firstnameSchema,
      last_name: lastnameSchema,
      phone_number: phone_numberSchema,
      email: {
        ...emailSchema,
        custom: {
          options: async (value) => {
            const user = await userService.getUserByEmail(value);
            if (user) {
              throw new Error(USER_MESSAGES.EMAIL_ALREADY_EXISTS);
            }
            return true;
          },
        },
      },
      password: passwordSchema,
    },
    ['body'],
  ),
);

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value, { req }) => {
            const user = await DatabaseInstance.getPrismaInstance().user.findUnique({
              where: {
                email: value,
                password: hashPassword(req.body.password),
              },
            });
            if (user === null) {
              throw new Error(USER_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT);
            }

            // lưu thông tin user vào req.user
            req.user = user;
            return true;
          },
        },
      },
      password: passwordSchema,
    },
    ['body'],
  ),
);
export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value, { req }) => {
            const user = await userService.getUserByEmail(value);
            if (!user) {
              throw new Error(USER_MESSAGES.USER_NOT_FOUND);
            }

            req.user = user;
            return true;
          },
        },
      },
    },
    ['body'],
  ),
);
export const verifyForgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: {
        trim: true,
        custom: {
          // kiểm tra xem có truyền lên token hay không
          options: async (value, { req }) => {
            try {
              if (!value) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
                  status: HTTP_STATUS.UNAUTHORIZED,
                });
              }
              const decoded_forgot_password_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
              });
              // lưu thông tin decoded_forgot_password_token vào req
              (req as Request).decoded_forgot_password_token = decoded_forgot_password_token;
              const { user_id } = req.decoded_forgot_password_token as TokenPayload;
              // dựa vào user_id tìm user
              const user = await DatabaseInstance.getPrismaInstance().user.findUnique({
                where: {
                  id: user_id,
                },
              });

              if (!user) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGES.USER_NOT_FOUND,
                  status: HTTP_STATUS.NOT_FOUND,
                });
              }
              if (user.forgot_password_token !== value) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_INVALID,
                  status: HTTP_STATUS.UNAUTHORIZED,
                });
              }
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: (error as JsonWebTokenError).message,
                  status: HTTP_STATUS.UNAUTHORIZED,
                });
              }

              throw error;
            }
            return true;
          },
        },
      },
    },
    ['body'],
  ),
);

// hàm này có có vấn đề, nó log ra terminal [object Object] khi có lỗi từ jwt hết hạn
export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const access_token = value.split(' ')[1];
            if (!access_token) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED,
              });
            }
            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
              });
              req.decoded_authorization = decoded_authorization;
            } catch (error) {
              throw new ErrorWithStatus({
                message: (error as JsonWebTokenError).message,
                status: HTTP_STATUS.UNAUTHORIZED,
              });
            }
            return true;
          },
        },
      },
    },
    ['headers'],
  ),
);

export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchema,
      confirm_password: confirmPasswordSchema,
    },
    ['body'],
  ),
);

export const updateMeValidator = validate(
  checkSchema(
    {
      first_name: { ...firstnameSchema, optional: true, notEmpty: undefined },
      last_name: { ...lastnameSchema, optional: true, notEmpty: undefined },
      phone_number: { ...phone_numberSchema },
      address: {
        ...addressSchema,
      },
      avatar_url: {
        ...imageSchema,
        notEmpty: undefined,
      },
    },
    ['body'],
  ),
);
