import { checkSchema } from 'express-validator';
import { validate } from '~/utils/validation';
import { VOUCHER_MESSAGES } from './messages';

export const addVoucherValidator = validate(
  checkSchema({
    value: {
      notEmpty: {
        errorMessage: VOUCHER_MESSAGES.VALUE_IS_REQUIRED,
      },
      isNumeric: {
        errorMessage: VOUCHER_MESSAGES.VALUE_MUST_BE_NUMERIC,
      },
    },
  }),
);
