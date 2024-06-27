import { checkSchema } from 'express-validator';
import { validate } from '~/utils/validation';
import { PAGINATION_MESSAGES } from './messages';
import { userIdSchema } from '../user/middlewares';

export const paginationValidator = validate(
  checkSchema(
    {
      limit: {
        isNumeric: true,
        custom: {
          options: (value) => {
            const num = Number(value);
            if (num > 100 || num < 1) {
              throw new Error(PAGINATION_MESSAGES.LIMIT_MUST_BE_LESS_THAN_100);
            }
            return true;
          },
        },
      },
      page: {
        isNumeric: true,
        custom: {
          options: (value) => {
            const num = Number(value);
            if (num < 1) {
              throw new Error(PAGINATION_MESSAGES.LIMIT_MUST_BE_GEATER_THAN_0);
            }
            return true;
          },
        },
      },
    },
    ['query'],
  ),
);

export const getConversationValidator = validate(
  checkSchema(
    {
      user_id: userIdSchema,
    },
    ['params'],
  ),
);
