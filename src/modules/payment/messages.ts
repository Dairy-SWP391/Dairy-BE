export const PAY_MESSAGE = {
  PAYMENT_SUCCESS: 'Payment successful',
  PAYMENT_FAILED: 'Payment failed',
  PAYMENT_CANCELLED: 'Payment cancelled',
  AMOUNT_MUST_BE_NUMBER: 'Amount must be a number',
  AMOUNT_IS_REQUIRED: 'Amount is required',
  ORDER_DESCRIPTION_MUST_BE_STRING: 'Order description must be a string',
  ORDER_DESCRIPTION_LENGTH: 'Order description must be between 1 and 255 characters',
  ORDER_DESCRIPTION_IS_REQUIRED: 'Order description is required',
  RETURN_URL_IS_INVALID: 'Return URL is invalid',
} as const;
