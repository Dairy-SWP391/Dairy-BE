export const USER_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  ACCOUNT_BANNED: 'Account is banned',
  // username
  USERNAME_IS_REQUIRED: 'Username is required',
  USERNAME_MUST_BE_STRING: 'Username must be a string',
  USERNAME_LENGTH_MUST_BE_FROM_1_TO_50: 'Username must be between 1 and 50 characters',
  USERNAME_MUST_CONTAIN_ALPHABET: 'Username must contain alphabet',
  USER_NOT_FOUND: 'User is not found',
  EMAIL_OR_PHONE_NUMBER_IS_REQUIRED: 'Email or phone number is required',

  // email
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_IS_NOT_REGISTERED: 'Email is not registered!',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  EMAIL_NOT_VERIFIED: 'Email is not verified',

  // phone number
  PHONE_NUMBER_IS_REQUIRED: 'Phone number is required',
  PHONE_NUMBER_MUST_BE_STRING: 'Phone number must be a string',
  PHONE_NUMBER_IS_INVALID: 'Phone number is invalid',
  PHONE_NUMBER_IS_ALREADY_EXISTED: 'Phone number is already existed!',
  PHONE_NUMBER_IS_NOT_REGISTERED: 'Phone number is not registered!',

  // password
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRING: 'Password must be a string',
  PASSWORD_MUST_BE_STRONG: 'Password must be strong',

  // confirm password
  CONFIRM_PASSWORD_MUST_MATCH_PASSWORD: 'Confirm password must match password',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_MUST_BE_STRONG: 'Confirm password must be strong',

  // first name
  FIRST_NAME_IS_REQUIRED: 'First name is required',
  FIRST_NAME_MUST_BE_STRING: 'First name must be a string',
  FIRST_NAME_LENGTH_MUST_BE_FROM_1_TO_50: 'First name must be between 1 and 50 characters',

  // last name
  LAST_NAME_IS_REQUIRED: 'Last name is required',
  LAST_NAME_MUST_BE_STRING: 'Last name must be a string',
  LAST_NAME_LENGTH_MUST_BE_FROM_1_TO_50: 'Last name must be between 1 and 50 characters',

  // address
  ADDRESS_MUST_BE_STRING: 'Address must be a string',

  // user messages
  REGISTER_SUCCESS: 'Register successfully',
  REGISTER_FAILED: 'Register failed',

  // register
  USERNAME_ALREADY_EXISTS: 'Username is already exist',
  EMAIL_ALREADY_EXISTS: 'Email is already exist',

  // login
  FIELD_IS_REQUIRED: 'Email or phone number is required',
  USERNAME_NOT_FOUND: 'Username is not found',
  PASSWORD_IS_WRONG: 'Password is wrong',
  EMAIL_NOT_FOUND: 'Email is not found',
  PHONE_NUMBER_NOT_FOUND: 'Phone number is not found',
  LOGIN_SUCCESS: 'Login successfully',
  FIELD_ERROR_FORMAT: 'Should be an email or phone number',

  // error messages
  UNPROCESSABLE_ENTITY: 'Validation: Unprocessable Entity',

  // forgot password
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check your email to get token to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  SEND_OTP_SUCCESSFULLY: 'Send OTP successfully!',
  OTP_IS_INCORRECT: 'OTP is incorrect',
  VERIFY_TOKEN_SUCCESSFULLY: 'Verify token successfully',
  RESET_PASSWORD_SUCCESSFULLY: 'Reset password successfully',
  OTP_NOT_FOUND: 'OTP is not found',
  REQUIRE_FIELD_IS_INVALID: 'Require field is invalid',
  FORGOT_PASSWORD_TOKEN_IS_INVALID: 'Forgot password token is invalid',

  // verify account
  VERIFY_ACCOUNT_OTP_IS_REQUIRED: 'Verify account otp is required',
  VERIFY_ACCOUNT_SUCCESSFULLY: 'Verify account successfully',
  USER_IS_NOT_VERIFIED: 'User is not verified',

  // get me
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  GET_ME_SUCCESS: 'Get me successfully',

  // update me
  UPDATE_ME_SUCCESS: 'Update me successfully',

  // image
  IMAGE_URL_MUST_BE_A_STRING: 'Image url must be a string',
  IMAGE_URL_LENGTH_MUST_BE_FROM_1_TO_400: 'Image url length must be between 1 and 400 characters',

  // get access token
  GET_ACCESS_TOKEN_SUCCESS: 'Get access token successfully',

  // add address
  DEFAULT_ADDRESS_MUST_BE_BOOLEAN: 'Default address must be a boolean',
  ADD_ADDRESS_SUCCESS: 'Add address successfully',
  USER_ID_MUST_MATCH_USER_ID_IN_TOKEN: 'User id must match user id in token',
  ADDRESS_IS_REQUIRED: 'Address is required',
  DEFAULT_ADDRESS_IS_REQUIRED: 'Default address is required',
  ADDRESS_LENGTH_MUST_BE_FROM_10_TO_255: 'Address length must be between 10 and 255 characters',

  // get all addresses of users
  GET_ALL_ADDRESSES_SUCCESS: 'Get all addresses successfully',

  // update address
  UPDATE_ADDRESS_SUCCESS: 'Update address successfully',
  ID_NOT_FOUND: 'Id is not found',
  ADDRESS_NOT_FOUND: 'Address is not found',

  // get all users
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  GET_ALL_USERS_SUCCESS: 'Get all users successfully',
  USER_IS_NOT_AUTHORIZED: 'User is not authorized',

  // update user
  USER_ID_IS_REQUIRED: 'User id is required',
  USER_ID_MUST_BE_STRING: 'User id must be a string',
  STATUS_IS_REQUIRED: 'Status is required',
  UPDATE_USER_SUCCESS: 'Update user successfully',
  USER_CANNOT_BE_UPDATED: 'User cannot be updated',
  STATUS_MUST_BE_UNVERIFIED_VERIFIED_BANNED: 'Status must be unverified, verified, banned',
  BAN_REASON_MUST_BE_STRING: 'Ban reason must be a string',

  // delete user
  DELETE_USER_SUCCESS: 'Delete user successfully',
  USER_CANNOT_BE_DELETED: 'User cannot be deleted',

  // add product to wishlist
  PRODUCT_ID_IS_REQUIRED: 'Product id is required',
  PRODUCT_ID_MUST_BE_NUMBER: 'Product id must be a number',
  ADD_PRODUCT_TO_WISHLIST_SUCCESS: 'Add product to wishlist success',

  PRODUCT_ID_NOT_FOUND: 'Product id is not found',
  PRODUCT_ALREADY_ADD_TO_WISHLIST: 'Product already add to wishlist',
  USER_MUST_BE_MEMBER: 'User must be member',

  // get wishlist
  GET_WISHLIST_SUCCESS: 'Get wishlist success',
  NUM_OF_ITEMS_PER_PAGE_MUST_BE_NUMBER: 'Num of items per page must be a number',
  PAGE_IS_REQUIRED: 'Page is required',
  PAGE_MUST_BE_NUMBER: 'Page must be a number',
  PAGE_MUST_BE_GREATER_THAN_0: 'Page must be greater than 0',

  // delete product from wishlist
  PRODUCT_NOT_FOUND_IN_WISHLIST: 'Product not found in wishlist',
  DELETE_PRODUCT_FROM_WISHLIST_SUCCESS: 'Delete product from wishlist success',

  // address
  PROVINCE_ID_IS_REQUIRED: 'Province id is required',
  PROVINCE_ID_MUST_BE_NUMBER: 'Province id must be a number',
  DISTRICT_ID_IS_REQUIRED: 'District id is required',
  DISTRICT_ID_MUST_BE_NUMBER: 'District id must be a number',
  WARD_CODE_IS_REQUIRED: 'Ward code is required',
  WARD_CODE_MUST_BE_NUMBER: 'Ward code must be a number',

  GET_EXPENSE_SUCCESS: 'Get expense success',

  // role
  ROLE_MUST_BE_STRING: 'Role must be a string',
  ROLE_MUST_BE_MEMBER_STAFF_ADMIN: 'Role must be member, staff, admin',
} as const;
