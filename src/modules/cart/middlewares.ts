import { validate } from '~/utils/validation';
import { CART_MESSAGES } from './messages';
import { checkSchema } from 'express-validator';
import { DatabaseInstance } from '~/database/database.services';

export const getCartValidator = validate(
  checkSchema(
    {
      '*.id': {
        notEmpty: {
          errorMessage: CART_MESSAGES.PRODUCT_ID_IS_REQUIRED,
        },
        isNumeric: {
          errorMessage: CART_MESSAGES.PRODUCT_ID_MUST_BE_NUMBER,
        },
        custom: {
          options: async (value) => {
            const found = await DatabaseInstance.getPrismaInstance().product.findUnique({
              where: {
                id: value,
              },
            });
            if (!found) {
              throw new Error(CART_MESSAGES.PRODUCT_ID_NOT_FOUND);
            }
            return true;
          },
        },
      },
      '*.quantity': {
        notEmpty: {
          errorMessage: CART_MESSAGES.QUANTITY_IS_REQUIRED,
        },
        isNumeric: {
          errorMessage: CART_MESSAGES.QUANTITY_MUST_BE_NUMBER,
        },
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(CART_MESSAGES.QUANTITY_MUST_BE_GREATER_THAN_0);
            }
            return true;
          },
        },
      },
    },
    ['body'],
  ),
);
