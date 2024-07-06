import { checkSchema } from 'express-validator';
import { validate } from '~/utils/validation';
import { SHIP_MESSAGES } from './messages';

export const getDistrictsMiddleware = validate(
  checkSchema(
    {
      province_id: {
        isString: {
          errorMessage: SHIP_MESSAGES.PROVINCE_ID_MUST_BE_STRING,
        },
        notEmpty: {
          errorMessage: SHIP_MESSAGES.PROVINCE_ID_IS_REQUIRED,
        },
      },
    },
    ['body'],
  ),
);

export const getWardsMiddleware = validate(
  checkSchema(
    {
      district_id: {
        isString: {
          errorMessage: SHIP_MESSAGES.DISTRICT_ID_MUST_BE_STRING,
        },
        notEmpty: {
          errorMessage: SHIP_MESSAGES.DISTRICT_ID_IS_REQUIRED,
        },
      },
    },
    ['body'],
  ),
);

export const getPackageServicesMiddleware = validate(
  checkSchema(
    {
      to_district: {
        isString: {
          errorMessage: SHIP_MESSAGES.DISTRICT_ID_MUST_BE_STRING,
        },
        notEmpty: {
          errorMessage: SHIP_MESSAGES.DISTRICT_ID_IS_REQUIRED,
        },
      },
    },
    ['body'],
  ),
);

export const getFeeMiddleware = validate(
  checkSchema(
    {
      service_id: {
        isString: {
          errorMessage: SHIP_MESSAGES.SERVICE_ID_MUST_BE_STRING,
        },
        notEmpty: {
          errorMessage: SHIP_MESSAGES.SERVICE_ID_IS_REQUIRED,
        },
      },
      to_district_id: {
        isString: {
          errorMessage: SHIP_MESSAGES.DISTRICT_ID_MUST_BE_STRING,
        },
        notEmpty: {
          errorMessage: SHIP_MESSAGES.DISTRICT_ID_IS_REQUIRED,
        },
      },
      to_ward_code: {
        isString: {
          errorMessage: SHIP_MESSAGES.WARD_CODE_MUST_BE_STRING,
        },
        notEmpty: {
          errorMessage: SHIP_MESSAGES.WARD_CODE_IS_REQUIRED,
        },
      },
      receiver_name: {
        isString: {
          errorMessage: SHIP_MESSAGES.RECEIVER_NAME_MUST_BE_STRING,
        },
        notEmpty: {
          errorMessage: SHIP_MESSAGES.RECEIVER_NAME_IS_REQUIRED,
        },
      },
      phone_number: {
        isString: {
          errorMessage: SHIP_MESSAGES.PHONE_NUMBER_MUST_BE_STRING,
        },
        notEmpty: {
          errorMessage: SHIP_MESSAGES.PHONE_NUMBER_IS_REQUIRED,
        },
      },
      address: {
        isString: {
          errorMessage: SHIP_MESSAGES.ADDRESS_MUST_BE_STRING,
        },
        notEmpty: {
          errorMessage: SHIP_MESSAGES.ADDRESS_IS_REQUIRED,
        },
      },
    },
    ['body'],
  ),
);
