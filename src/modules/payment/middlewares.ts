// import { checkSchema } from 'express-validator';
// import { validate } from '~/utils/validation';
// import { PAY_MESSAGE } from './messages';

// export const createPaymentValidate = validate(
//   checkSchema(
//     {
//       amount: {
//         isNumeric: {
//           errorMessage: PAY_MESSAGE.AMOUNT_MUST_BE_NUMBER,
//         },
//         notEmpty: {
//           errorMessage: PAY_MESSAGE.AMOUNT_IS_REQUIRED,
//         },
//       },
//       order_description: {
//         isString: {
//           errorMessage: PAY_MESSAGE.ORDER_DESCRIPTION_MUST_BE_STRING,
//         },
//         isLength: {
//           options: { min: 1, max: 255 },
//           errorMessage: PAY_MESSAGE.ORDER_DESCRIPTION_LENGTH,
//         },
//         notEmpty: {
//           errorMessage: PAY_MESSAGE.ORDER_DESCRIPTION_IS_REQUIRED,
//         },
//       },
//     },
//     ['body'],
//   ),
// );
