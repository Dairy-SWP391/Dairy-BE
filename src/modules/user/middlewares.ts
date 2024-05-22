import { ParamSchema, checkSchema } from 'express-validator';
import { USER_MESSAGES } from './messages';
import { validate } from '~/utils/validation';
import userService from './service';
import { hashPassword } from '~/utils/crypto';
import { DatabaseInstance } from '~/database/database.services';

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

// const imageSchema: ParamSchema = {
//   optional: true,
//   isString: {
//     errorMessage: USER_MESSAGES.IMAGE_URL_MUST_BE_A_STRING,
//   },
//   trim: true,
//   isLength: {
//     options: {
//       min: 1,
//       max: 400,
//     },
//     errorMessage: USER_MESSAGES.IMAGE_URL_LENGTH_MUST_BE_FROM_1_TO_400,
//   },
// };

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
            if (user === null) {
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
