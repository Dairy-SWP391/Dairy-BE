import { checkSchema, ParamSchema } from 'express-validator';
import { validate } from '~/utils/validation';
import { VOUCHER_MESSAGES } from './messages';
import { DatabaseInstance } from '~/database/database.services';

const CodeSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: VOUCHER_MESSAGES.CODE_MUST_BE_STRING,
  },
  isLength: {
    options: {
      max: 8,
    },
    errorMessage: VOUCHER_MESSAGES.CODE_MUST_BE_LESS_THAN_8_CHARACTERS,
  },
};
const ValueSchema: ParamSchema = {
  notEmpty: {
    errorMessage: VOUCHER_MESSAGES.VALUE_IS_REQUIRED,
  },
  isNumeric: {
    errorMessage: VOUCHER_MESSAGES.VALUE_MUST_BE_NUMERIC,
  },
};
const TradingPointSchema: ParamSchema = {
  notEmpty: {
    errorMessage: VOUCHER_MESSAGES.TRADING_POINT_IS_REQUIRED,
  },
  isNumeric: {
    errorMessage: VOUCHER_MESSAGES.TRADING_POINT_MUST_BE_NUMERIC,
  },
};
const ExpiredAtSchema: ParamSchema = {
  notEmpty: {
    errorMessage: VOUCHER_MESSAGES.EXPIRED_AT_IS_REQUIRED,
  },
  isISO8601: {
    errorMessage: VOUCHER_MESSAGES.EXPIRED_AT_MUST_BE_ISO8601,
  },
};
const QuantitySchema: ParamSchema = {
  notEmpty: {
    errorMessage: VOUCHER_MESSAGES.QUANTITY_IS_REQUIRED,
  },
  isNumeric: {
    errorMessage: VOUCHER_MESSAGES.QUANTITY_MUST_BE_NUMERIC,
  },
};
const StatusSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: VOUCHER_MESSAGES.STATUS_MUST_BE_STRING,
  },
  custom: {
    options: (value) => {
      if (value && value !== 'ACTIVE' && value !== 'INACTIVE') {
        throw new Error(VOUCHER_MESSAGES.STATUS_MUST_BE_ACTIVE_OR_INACTIVE);
      }
      return true;
    },
  },
};

export const addVoucherValidator = validate(
  checkSchema(
    {
      code: CodeSchema,
      value: ValueSchema,
      trading_point: TradingPointSchema,
      expired_at: ExpiredAtSchema,
      quantity: QuantitySchema,
      status: StatusSchema,
    },
    ['body'],
  ),
);

export const editVoucherValidator = validate(
  checkSchema({
    id: {
      notEmpty: {
        errorMessage: VOUCHER_MESSAGES.ID_IS_REQUIRED,
      },
      isNumeric: {
        errorMessage: VOUCHER_MESSAGES.ID_MUST_BE_NUMERIC,
      },
      custom: {
        options: async (value) => {
          const voucher = await DatabaseInstance.getPrismaInstance().voucher.findUnique({
            where: {
              id: Number(value),
            },
          });
          if (!voucher) {
            throw new Error(VOUCHER_MESSAGES.ID_IS_NOT_EXIST);
          }
          return true;
        },
      },
    },
    value: { ...ValueSchema, optional: true, notEmpty: undefined },
    trading_point: { ...TradingPointSchema, optional: true, notEmpty: undefined },
    expired_at: { ...ExpiredAtSchema, optional: true, notEmpty: undefined },
    quantity: { ...QuantitySchema, optional: true, notEmpty: undefined },
    status: { ...StatusSchema, optional: true, notEmpty: undefined },
  }),
);
