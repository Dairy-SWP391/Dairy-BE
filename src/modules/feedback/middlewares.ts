import { checkSchema } from 'express-validator';
import { DatabaseInstance } from '~/database/database.services';
import { validate } from '~/utils/validation';
import { FEEDBACK_MESSAGES } from './messages';
import productService from '../product/service';

export const feedbackValidator = validate(
  checkSchema(
    {
      order_detail_id: {
        notEmpty: { errorMessage: FEEDBACK_MESSAGES.ORDER_DETAIL_ID_REQUIRED },
        isNumeric: {
          errorMessage: FEEDBACK_MESSAGES.ORDER_DETAIL_ID_MUST_BE_A_NUMBER,
        },
        custom: {
          options: async (value, { req }) => {
            const orderDetail = await DatabaseInstance.getPrismaInstance().order.findMany({
              where: {
                user_id: req.decoded_authorization.user_id,
                OrderDetail: {
                  some: {
                    id: value,
                  },
                },
              },
            });

            if (orderDetail.length === 0) {
              throw new Error(FEEDBACK_MESSAGES.ORDER_DETAIL_NOT_FOUND);
            }

            const feedback = await DatabaseInstance.getPrismaInstance().feedback.findFirst({
              where: {
                order_detail_id: value,
              },
            });

            if (feedback) {
              throw new Error(FEEDBACK_MESSAGES.FEEDBACK_ALREADY_EXISTS);
            }
            return true;
          },
        },
      },
      content: {
        optional: true,
        trim: true,
        isString: { errorMessage: FEEDBACK_MESSAGES.CONTENT_MUST_BE_A_STRING },
        isLength: {
          errorMessage: 'Content must be between 10 and 100 characters',
          options: { min: 10, max: 100 },
        },
      },
      rating_point: {
        notEmpty: { errorMessage: FEEDBACK_MESSAGES.RATING_POINT_IS_REQUIRED },
        isNumeric: { errorMessage: FEEDBACK_MESSAGES.RATING_POINT_MUST_BE_A_NUMBER },
        custom: {
          options: (value) => {
            if (value < 1 || value > 5) {
              throw new Error(FEEDBACK_MESSAGES.RATING_POINT_MUST_BE_BEWTEEN_1_AND_5);
            }
            return true;
          },
        },
      },
    },
    ['body'],
  ),
);

export const getFeedbackValidator = validate(
  checkSchema(
    {
      product_id: {
        notEmpty: { errorMessage: FEEDBACK_MESSAGES.PRODUCT_ID_REQUIRED },
        isNumeric: { errorMessage: FEEDBACK_MESSAGES.PRODUCT_ID_MUST_BE_A_NUMBER },
        custom: {
          options: async (value) => {
            const product = await productService.getProductById(value);
            if (!product) {
              throw new Error(FEEDBACK_MESSAGES.PRODUCT_NOT_FOUND);
            }
          },
        },
      },
    },
    ['query'],
  ),
);

export const sendFeedbackValidator = validate(checkSchema({}));
