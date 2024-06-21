import { ParamSchema, checkSchema } from 'express-validator';
import { validate } from '~/utils/validation';
import { POST_MESSAGES } from './messages';
import { TokenPayload } from '../user/requests';
import { DatabaseInstance } from '~/database/database.services';

const titleSchema: ParamSchema = {
  notEmpty: {
    errorMessage: POST_MESSAGES.TITLE_IS_REQUIRED,
  },
  trim: true,
  isString: true,
  isLength: {
    options: {
      min: 1,
      max: 191,
    },
    errorMessage: POST_MESSAGES.TITLE_LENGTH_MUST_BE_BETWEEN_1_AND_191_CHARS,
  },
};
const contentSchema: ParamSchema = {
  notEmpty: {
    errorMessage: POST_MESSAGES.CONTENT_IS_REQUIRED,
  },
  trim: true,
  isString: {
    errorMessage: POST_MESSAGES.CONTENT_MUST_BE_STRING,
  },
  isLength: {
    options: {
      min: 1,
      max: 191,
    },
    errorMessage: POST_MESSAGES.CONTENT_MUST_BE_BETWEEN_1_AND_191_CHARS,
  },
};
const creatorIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: POST_MESSAGES.CREATOR_ID_IS_REQUIRED,
  },
  isString: { errorMessage: POST_MESSAGES.CREATOR_ID_MUST_BE_STRING },
  trim: true,
  custom: {
    options: (value, { req }) => {
      const { user_id } = req.decoded_authorization as TokenPayload;
      if (value !== user_id) {
        throw new Error(POST_MESSAGES.CREATOR_ID_MUST_MATCH_USER_ID_IN_ACCESS_TOKEN);
      }
      return true;
    },
  },
};

const imageSchema: ParamSchema = {
  optional: true,
  isArray: {
    errorMessage: POST_MESSAGES.IMAGES_MUST_BE_ARRAY,
  },
  custom: {
    options: (value) => {
      if (value.length === 0) {
        throw new Error(POST_MESSAGES.IMAGES_MUST_BE_NOT_EMPTY);
      }
      if (
        !value.every((image: string) => {
          // Kiểm tra xem mỗi phần tử có phải là URL không
          try {
            new URL(image);
            return true;
          } catch (error) {
            return false;
          }
        })
      ) {
        throw new Error(POST_MESSAGES.IMAGES_MUST_BE_URL);
      }
      return true;
    },
  },
};
const postCategoryIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: POST_MESSAGES.POST_CATOGERY_ID_IS_REQUIRED,
  },
  isNumeric: {
    errorMessage: POST_MESSAGES.POST_CATOGORY_ID_MUST_BE_A_NUMBER,
  },
  custom: {
    options: async (value) => {
      if (value < 1) {
        throw new Error(POST_MESSAGES.INVALID_CATEGORY_ID);
      }

      const post_category_id = await DatabaseInstance.getPrismaInstance().postCategory.findUnique({
        where: {
          id: value,
        },
      });
      if (!post_category_id) {
        throw new Error(POST_MESSAGES.POST_CATOGORY_ID_NOT_FOUND);
      }
      return true;
    },
  },
};
export const addPostValidator = validate(
  checkSchema(
    {
      title: titleSchema,
      content: contentSchema,
      creator_id: creatorIdSchema,
      post_category_id: postCategoryIdSchema,
      images: imageSchema,
    },
    ['body'],
  ),
);
