export const PRODUCT_MESSAGES = {
  // get product detail
  NOT_FOUND: 'Product not found',
  GET_PRODUCT_DETAIL_SUCCESS: 'Get product detail success',
  // add product
  ADD_PRODUCT_SUCCESS: 'Add product success',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  USER_IS_NOT_AUTHORIZED: 'User is not authorized',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_50: 'Name length must be from 1 to 50',
  QUANTITY_IS_REQUIRED: 'Quantity is required',
  QUANTITY_MUST_A_NUMBER: 'Quantity must be a number',
  RATING_NUMBER_MUST_A_NUMBER: 'Rating number must be a number',
  RATING_NUMBER_IS_REQUIRED: 'Rating number is required',
  RATING_POINT_IS_REQUIRED: 'Rating point is required',
  RATING_POINT_MUST_A_NUMBER: 'Rating point must be a number',
  BRAND_ID_IS_REQUIRED: 'Brand id is required',
  BRAND_ID_MUST_A_NUMBER: 'Brand id must be a number',
  ORIGIN_MUST_BE_STRING: 'Origin must be a string',
  ORIGIN_LENGTH_MUST_BE_FROM_1_TO_50: 'Origin length must be from 1 to 50',
  PRODUCER_MUST_BE_STRING: 'Producer must be a string',
  PRODUCER_LENGTH_MUST_BE_FROM_1_TO_50: 'Producer length must be from 1 to 50',
  MANUFACTURED_AT_MUST_BE_STRING: 'Manufactured at must be a string',
  MANUFACTURED_AT_LENGTH_MUST_BE_FROM_1_TO_200: 'Manufactured at length must be from 1 to 200',
  TARGET_AT_MUST_BE_STRING: 'Target at must be a string',
  ORIGIN_LENGTH_MUST_BE_FROM_1_TO_200: 'Origin length must be from 1 to 200',
  VOLUME_MUST_BE_NUMBER: 'Volume must be a number',
  CAUTION_AT_MUST_BE_STRING: 'Caution at must be a string',
  CAUTION_LENGTH_MUST_BE_FROM_1_TO_200: 'Caution length must be from 1 to 200',
  CATEGORY_ID_IS_REQUIRED: 'Category id is required',
  CATEGORY_ID__MUST_A_NUMBER: 'Category id must be a number',
  PRESERVATION_MUST_BE_STRING: 'Preservation must be a string',
  PRESERVATION_LENGTH_MUST_BE_FROM_1_TO_50: 'Preservation length must be from 1 to 50',
  DESCRIPTION_MUST_BE_STRING: 'Description must be a string',
  DESCRIPTION_LENGTH_MUST_BE_FROM_1_TO_200: 'Description length must be from 1 to 200',
  INTRUCTION_MUST_BE_STRING: 'Instruction must be a string',
  INSTRUCTION_LENGTH_MUST_BE_FROM_1_TO_200: 'Instruction length must be from 1 to 200',
  PRICE_MUST_BE_NUMBER: 'Price must be a number',
  IMAGES_MUST_BE_ARRAY: 'Images must be an array',
  IMAGES_MUST_BE_URL: 'Images must be a URL',
  IMAGES_MUST_BE_STRING: 'Images must be a string',
  IMAGES_MUST_BE_NOT_EMPTY: 'Images must be not empty',
  PRICE_IS_REQUIRED: 'Price is required',
  SALE_PRICE_IS_REQUIRED: 'Sale price is required',
  SALE_PRICE_MUST_BE_NUMBER: 'Sale price must be a number',
  BRAND_ID_IS_INVALID: 'Brand id is invalid',
  CATEGORY_ID_IS_INVALID: 'Category id is invalid',
  STARTING_TIMESTAMP_IS_REQUIRED: 'Starting timestamp is required',
  STARTING_TIMESTAMP_MUST_BE_A_DATE: 'Starting timestamp must be a date',
  ENDING_TIMESTAMP_MUST_BE_A_DATE: 'Ending timestamp must be a date',
  // get product based on category, sorting, pagination
  PARENT_CATEGORY_ID_IS_REQUIRED: 'Parent category id is required',
  PARENT_CATEGORY_ID_NOT_FOUND: 'Parent category id not found',
  PARENT_CATEGORY_ID_MUST_BE_NUMBER: 'Parent category id must be a number',
  NUM_OF_PRODUCT_MUST_BE_NUMBER: 'Num of product must be a number',
  NUM_OF_ITEMS_PER_PAGE_MUST_BE_NUMBER: 'Num of items per page must be a number',
  PAGE_MUST_BE_NUMBER: 'Page must be a number',
  PAGINATION_IS_INVALID: 'Pagination is invalid',
  PAGE_MUST_BE_GREATER_THAN_0: 'Page must be greater than 0',
  SORT_BY_MUST_BE_STRING: 'Sort by must be a string',
  ORDER_BY_MUST_BE_STRING: 'Order by must be a string',
  GET_PRODUCT_BASED_ON_CATEGORY_SORT_PAGINATION_SUCCESS:
    'Get product based on category, sort and pagination success',
  CATEGORY_ID_NOT_FOUND: 'Category id not found',
  NUM_OF_PRODUCT_IS_REQUIRED: 'Num of product is required',
  PAGE_IS_REQUIRED: 'Page is required',
  SORT_BY_MUST_BASED_ON_PRICE_RATING_POINT_SOLD_DISCOUNT:
    'Sort by must be based on price, rating point, sold, discount',

  ORDER_BY_MUST_BE_ASC_OR_DESC: 'Order by must be ASC or DESC',
} as const;
