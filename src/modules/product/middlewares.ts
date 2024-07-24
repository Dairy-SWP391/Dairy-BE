import { ParamSchema, checkSchema } from 'express-validator';
import { validate } from '~/utils/validation';
import { ErrorWithStatus } from '../error/entityError';
import { PRODUCT_MESSAGES } from './messages';
import HTTP_STATUS from '~/constants/httpsStatus';
import { verifyToken } from '~/utils/jwt';
import { JsonWebTokenError } from 'jsonwebtoken';
import { DatabaseInstance } from '~/database/database.services';
import { ROLE, SHIP_CATEGORY_ID } from '@prisma/client';

const nameSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.NAME_IS_REQUIRED,
  },
  isString: {
    errorMessage: PRODUCT_MESSAGES.NAME_MUST_BE_STRING,
  },
  isLength: {
    options: {
      min: 1,
      max: 200,
    },
    errorMessage: PRODUCT_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_50,
  },
};
const quantitySchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.QUANTITY_IS_REQUIRED,
  },
  isNumeric: {
    errorMessage: PRODUCT_MESSAGES.QUANTITY_MUST_A_NUMBER,
  },
};
const ratingNumberSchema: ParamSchema = {
  // notEmpty: {
  //   errorMessage: PRODUCT_MESSAGES.RATING_NUMBER_IS_REQUIRED,
  // },
  optional: true,
  isNumeric: {
    errorMessage: PRODUCT_MESSAGES.RATING_NUMBER_MUST_A_NUMBER,
  },
};
const ratingPointSchema: ParamSchema = {
  // notEmpty: {
  //   errorMessage: PRODUCT_MESSAGES.RATING_POINT_IS_REQUIRED,
  // },
  optional: true,
  isNumeric: {
    errorMessage: PRODUCT_MESSAGES.RATING_POINT_MUST_A_NUMBER,
  },
};

export const brand_idSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.BRAND_ID_IS_REQUIRED,
  },
  isNumeric: {
    errorMessage: PRODUCT_MESSAGES.BRAND_ID_MUST_A_NUMBER,
  },
  custom: {
    options: async (value) => {
      const brand = await DatabaseInstance.getPrismaInstance().brand.findUnique({
        where: {
          id: Number(value),
        },
      });
      if (!brand) {
        throw new ErrorWithStatus({
          message: PRODUCT_MESSAGES.BRAND_ID_IS_INVALID,
          status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        });
      }
      return true;
    },
  },
};
const soldSchema: ParamSchema = {
  isNumeric: {
    errorMessage: PRODUCT_MESSAGES.SOLD_MUST_BE_NUMBER,
  },
  custom: {
    options: async (value) => {
      if (value < 0) {
        throw new Error(PRODUCT_MESSAGES.SOLD_MUST_BE_GREATER_THAN_OR_EQUAL_0);
      }
      return true;
    },
  },
};
const numOfPacksSchema: ParamSchema = {
  optional: true,
  isNumeric: {
    errorMessage: PRODUCT_MESSAGES.NUM_OF_PACK_MUST_BE_NUMBER,
  },
  custom: {
    options: (value) => {
      if (value < 0) {
        throw new Error(PRODUCT_MESSAGES.NUM_OF_PACK_MUST_BE_NUMBER);
      }
      return true;
    },
  },
};
const statusSchema: ParamSchema = {
  optional: true,
  trim: true,
  isString: {
    errorMessage: PRODUCT_MESSAGES.STATUS_MUST_BE_STRING,
  },
  custom: {
    options: (value) => {
      if (value !== 'ACTIVE' && value !== 'INACTIVE') {
        throw new Error(PRODUCT_MESSAGES.STATUS_MUST_BE_ACTIVE_OR_INACTIVE);
      }
      return true;
    },
  },
};

const brand_nameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.BRAND_NAME_IS_REQUIRED,
  },
  isString: {
    errorMessage: PRODUCT_MESSAGES.BRAND_ID_MUST_BE_A_STRING,
  },
};

const originSchema: ParamSchema = {
  optional: true,
  trim: true,
  isString: {
    errorMessage: PRODUCT_MESSAGES.ORIGIN_MUST_BE_STRING,
  },
  // isLength: {
  //   options: {
  //     min: 1,
  //     max: 50,
  //   },
  //   errorMessage: PRODUCT_MESSAGES.ORIGIN_LENGTH_MUST_BE_FROM_1_TO_50,
  // },
};
const producerSchema: ParamSchema = {
  optional: true,
  trim: true,
  isString: {
    errorMessage: PRODUCT_MESSAGES.PRODUCER_MUST_BE_STRING,
  },
  // isLength: {
  //   options: {
  //     min: 1,
  //     max: 50,
  //   },
  //   errorMessage: PRODUCT_MESSAGES.PRODUCER_LENGTH_MUST_BE_FROM_1_TO_50,
  // },
};
const manufacturedAtSchema: ParamSchema = {
  optional: true,
  trim: true,
  isString: {
    errorMessage: PRODUCT_MESSAGES.MANUFACTURED_AT_MUST_BE_STRING,
  },
  // isLength: {
  //   options: {
  //     min: 1,
  //     max: 50,
  //   },
  //   errorMessage: PRODUCT_MESSAGES.MANUFACTURED_AT_LENGTH_MUST_BE_FROM_1_TO_200,
  // },
};
const targetSchema: ParamSchema = {
  optional: true,
  trim: true,
  isString: {
    errorMessage: PRODUCT_MESSAGES.TARGET_AT_MUST_BE_STRING,
  },
  // isLength: {
  //   options: {
  //     min: 1,
  //     max: 50,
  //   },
  //   errorMessage: PRODUCT_MESSAGES.ORIGIN_LENGTH_MUST_BE_FROM_1_TO_200,
  // },
};
const volumeSchema: ParamSchema = {
  optional: true,
  isNumeric: {
    errorMessage: PRODUCT_MESSAGES.VOLUME_MUST_BE_NUMBER,
  },
};
const weightSchema: ParamSchema = {
  optional: true,
  isNumeric: {
    errorMessage: PRODUCT_MESSAGES.VOLUME_MUST_BE_NUMBER,
  },
};
const cautionSchema: ParamSchema = {
  optional: true,
  trim: true,
  isString: {
    errorMessage: PRODUCT_MESSAGES.CAUTION_AT_MUST_BE_STRING,
  },
  // isLength: {
  //   options: {
  //     min: 1,
  //     max: 200,
  //   },
  //   errorMessage: PRODUCT_MESSAGES.CAUTION_LENGTH_MUST_BE_FROM_1_TO_200,
  // },
};
const imageSchema: ParamSchema = {
  isArray: {
    errorMessage: PRODUCT_MESSAGES.IMAGES_MUST_BE_ARRAY,
  },
  custom: {
    options: (value) => {
      if (value.length === 0) {
        throw new Error(PRODUCT_MESSAGES.IMAGES_MUST_BE_NOT_EMPTY);
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
        throw new Error(PRODUCT_MESSAGES.IMAGES_MUST_BE_URL);
      }
      return true;
    },
  },
};
const preservationSchema: ParamSchema = {
  optional: true,
  trim: true,
  isString: {
    errorMessage: PRODUCT_MESSAGES.PRESERVATION_MUST_BE_STRING,
  },
  // isLength: {
  //   options: {
  //     min: 1,
  //     max: 200,
  //   },
  //   errorMessage: PRODUCT_MESSAGES.PRESERVATION_LENGTH_MUST_BE_FROM_1_TO_50,
  // },
};
const descriptionSchema: ParamSchema = {
  optional: true,
  trim: true,
  isString: {
    errorMessage: PRODUCT_MESSAGES.DESCRIPTION_MUST_BE_STRING,
  },
  // isLength: {
  //   options: {
  //     min: 1,
  //     max: 200,
  //   },
  //   errorMessage: PRODUCT_MESSAGES.DESCRIPTION_LENGTH_MUST_BE_FROM_1_TO_200,
  // },
};
const instructionSchema: ParamSchema = {
  optional: true,
  trim: true,
  isString: {
    errorMessage: PRODUCT_MESSAGES.INTRUCTION_MUST_BE_STRING,
  },
  // isLength: {
  //   options: {
  //     min: 1,
  //     max: 200,
  //   },
  //   errorMessage: PRODUCT_MESSAGES.INSTRUCTION_LENGTH_MUST_BE_FROM_1_TO_200,
  // },
};
const category_idSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.CATEGORY_ID_IS_REQUIRED,
  },
  isNumeric: {
    errorMessage: PRODUCT_MESSAGES.CATEGORY_ID__MUST_A_NUMBER,
  },
  custom: {
    options: async (value) => {
      const category = await DatabaseInstance.getPrismaInstance().category.findUnique({
        where: {
          id: Number(value),
        },
      });
      if (!category) {
        throw new ErrorWithStatus({
          message: PRODUCT_MESSAGES.CATEGORY_ID_IS_INVALID,
          status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        });
      }
      return true;
    },
  },
};
const priceSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.PRICE_IS_REQUIRED,
  },
  isNumeric: {
    errorMessage: PRODUCT_MESSAGES.PRICE_MUST_BE_NUMBER,
  },
};
const salePriceSchema: ParamSchema = {
  // notEmpty: {
  //   errorMessage: PRODUCT_MESSAGES.SALE_PRICE_IS_REQUIRED,
  // },
  optional: true,
  isNumeric: {
    errorMessage: PRODUCT_MESSAGES.SALE_PRICE_MUST_BE_NUMBER,
  },
};

const startingTimestampSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.STARTING_TIMESTAMP_IS_REQUIRED,
  },
  isISO8601: {
    errorMessage: PRODUCT_MESSAGES.STARTING_TIMESTAMP_MUST_BE_A_DATE,
  },
};

const endingTimestampSchema: ParamSchema = {
  optional: true,
  isISO8601: {
    errorMessage: PRODUCT_MESSAGES.ENDING_TIMESTAMP_MUST_BE_A_DATE,
  },
};

const shipCategoryIDSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.SHIP_CATEGORY_ID_IS_REQUIRED,
  },
  trim: true,
  isString: {
    errorMessage: PRODUCT_MESSAGES.SHIP_CATEGORY_ID_MUST_BE_A__STRING,
  },
  custom: {
    options: async (value) => {
      if (value !== SHIP_CATEGORY_ID.BABY && value !== SHIP_CATEGORY_ID.MOMY) {
        throw new Error(PRODUCT_MESSAGES.SHIP_CATEGORY_ID_MUST_BE_BABY_OR_MOM);
      }
    },
  },
};
export const roleValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            // lấy ra access_token từ header
            const access_token = value.split(' ')[1];
            // kiểm tra xem access_token có được truyền không
            if (!access_token) {
              throw new ErrorWithStatus({
                message: PRODUCT_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED,
              });
            }
            // kiểm tra xem access_token có tồn tại trong database không
            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
              });
              const { user_id } = decoded_authorization;

              // lấy ra user từ database
              const user = await DatabaseInstance.getPrismaInstance().user.findUnique({
                where: {
                  id: user_id,
                },
              });
              if (!user) {
                throw new ErrorWithStatus({
                  message: PRODUCT_MESSAGES.ACCESS_TOKEN_IS_INVALID,
                  status: HTTP_STATUS.UNAUTHORIZED,
                });
              }
              // kiểm tra xem user có quyền là ADMIN hoặc STAFF không
              if (user.role !== ROLE.STAFF && user.role !== ROLE.ADMIN) {
                throw new ErrorWithStatus({
                  message: PRODUCT_MESSAGES.USER_IS_NOT_AUTHORIZED,
                  status: HTTP_STATUS.UNAUTHORIZED,
                });
              }
              req.decoded_authorization = decoded_authorization;
            } catch (error) {
              throw new ErrorWithStatus({
                message: (error as JsonWebTokenError).message,
                status: HTTP_STATUS.UNAUTHORIZED,
              });
            }
            return true;
          },
        },
      },
    },
    ['headers'],
  ),
);
export const addProductValidator = validate(
  checkSchema(
    {
      name: nameSchema,
      quantity: quantitySchema,
      rating_number: ratingNumberSchema,
      rating_point: ratingPointSchema,
      brand_name: brand_nameSchema,
      origin: originSchema,
      producer: producerSchema,
      manufactured_at: manufacturedAtSchema,
      target: targetSchema,
      volume: volumeSchema,
      weight: weightSchema,
      caution: cautionSchema,
      images: {
        ...imageSchema,
      },
      preservation: preservationSchema,
      description: descriptionSchema,
      instruction: instructionSchema,
      category_id: category_idSchema,
      price: priceSchema,
      sale_price: salePriceSchema,
      starting_timestamp: startingTimestampSchema,
      ending_timestamp: endingTimestampSchema,
      ship_category_id: shipCategoryIDSchema,
    },
    ['body'],
  ),
);
export const getProductsByCategorySortAndPaginateValidator = validate(
  checkSchema(
    {
      parent_category_id: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGES.PARENT_CATEGORY_ID_IS_REQUIRED,
        },
        isNumeric: {
          errorMessage: PRODUCT_MESSAGES.PARENT_CATEGORY_ID_MUST_BE_NUMBER,
        },
      },
      category_id: {
        ...category_idSchema,
        optional: true,
      },
      num_of_product: {
        // notEmpty: {
        //   errorMessage: PRODUCT_MESSAGES.NUM_OF_PRODUCT_IS_REQUIRED,
        // },
        optional: true,
        isNumeric: {
          errorMessage: PRODUCT_MESSAGES.NUM_OF_PRODUCT_MUST_BE_NUMBER,
        },
      },
      num_of_items_per_page: {
        optional: true,
        isNumeric: {
          errorMessage: PRODUCT_MESSAGES.NUM_OF_ITEMS_PER_PAGE_MUST_BE_NUMBER,
        },
      },
      page: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGES.PAGE_IS_REQUIRED,
        },
        isNumeric: {
          errorMessage: PRODUCT_MESSAGES.PAGE_MUST_BE_NUMBER,
        },
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(PRODUCT_MESSAGES.PAGE_MUST_BE_GREATER_THAN_0);
            }

            return true;
          },
        },
      },
      sort_by: {
        optional: true,
        isString: {
          errorMessage: PRODUCT_MESSAGES.SORT_BY_MUST_BE_STRING,
        },
        custom: {
          options: (value) => {
            const validSortFields = ['price', 'rating_point', 'sold', 'discount'];
            // nếu truyền sort_by mà không phải là price, rating_point, sold
            if (value && !validSortFields.includes(value)) {
              throw new Error(
                PRODUCT_MESSAGES.SORT_BY_MUST_BASED_ON_PRICE_RATING_POINT_SOLD_DISCOUNT,
              );
            }
            return true;
          },
        },
      },
      order_by: {
        optional: true,
        isString: {
          errorMessage: PRODUCT_MESSAGES.ORDER_BY_MUST_BE_STRING,
        },
        custom: {
          options: (value) => {
            const validOrderFields = ['ASC', 'DESC'];
            if (value && !validOrderFields.includes(value)) {
              throw new Error(PRODUCT_MESSAGES.ORDER_BY_MUST_BE_ASC_OR_DESC);
            }
            return true;
          },
        },
      },
    },
    ['body'],
  ),
);

export const searchProductValidator = validate(
  checkSchema(
    {
      search: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGES.SEARCH_IS_REQUIRED,
        },
        trim: true,
        isString: {
          errorMessage: PRODUCT_MESSAGES.SEARCH_MUST_BE_STRING,
        },
      },
      num_of_items_per_page: {
        optional: true,
        isNumeric: {
          errorMessage: PRODUCT_MESSAGES.NUM_OF_ITEMS_PER_PAGE_MUST_BE_NUMBER,
        },
      },
      page: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGES.PAGE_IS_REQUIRED,
        },
        isNumeric: {
          errorMessage: PRODUCT_MESSAGES.PAGE_MUST_BE_NUMBER,
        },
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(PRODUCT_MESSAGES.PAGE_MUST_BE_GREATER_THAN_0);
            }
            return true;
          },
        },
      },
    },
    ['query'],
  ),
);
export const deleteProductValidator = validate(
  checkSchema(
    {
      id: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGES.ID_IS_REQUIRED,
        },
        isNumeric: {
          errorMessage: PRODUCT_MESSAGES.ID_MUST_BE_NUMBER,
        },
        custom: {
          options: async (value) => {
            const product = await DatabaseInstance.getPrismaInstance().product.findUnique({
              where: {
                id: Number(value),
              },
            });
            if (!product) {
              throw new Error(PRODUCT_MESSAGES.PRODUCT_ID_IS_INVALID);
            }

            return true;
          },
        },
      },
    },
    ['body'],
  ),
);
export const updateProductValidator = validate(
  checkSchema(
    {
      id: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGES.ID_IS_REQUIRED,
        },
        isNumeric: {
          errorMessage: PRODUCT_MESSAGES.ID_MUST_BE_NUMBER,
        },
        custom: {
          options: async (value) => {
            const product = await DatabaseInstance.getPrismaInstance().product.findUnique({
              where: {
                id: Number(value),
              },
            });
            if (!product) {
              throw new Error(PRODUCT_MESSAGES.PRODUCT_ID_IS_INVALID);
            }

            return true;
          },
        },
      },
      name: { ...nameSchema, optional: true, notEmpty: undefined },
      quantity: { ...quantitySchema, optional: true, notEmpty: undefined },
      rating_number: { ...ratingNumberSchema, optional: true, notEmpty: undefined },
      rating_point: { ...ratingPointSchema, optional: true, notEmpty: undefined },
      // brand_id: { ...brand_idSchema, optional: true, notEmpty: undefined },
      brand_name: { ...brand_nameSchema, optional: true, notEmpty: undefined },
      origin: { ...originSchema, optional: true, notEmpty: undefined, isLength: undefined },
      producer: { ...producerSchema, optional: true, notEmpty: undefined, isLength: undefined },
      manufactured_at: { ...manufacturedAtSchema, optional: true, notEmpty: undefined },
      target: { ...targetSchema, optional: true, notEmpty: undefined, isLength: undefined },
      volume: { ...volumeSchema, optional: true, notEmpty: undefined },
      weight: { ...weightSchema, optional: true, notEmpty: undefined },
      sold: { ...soldSchema, optional: true, notEmpty: undefined },
      caution: { ...cautionSchema, optional: true, notEmpty: undefined, isLength: undefined },
      instruction: {
        ...instructionSchema,
        optional: true,
        notEmpty: undefined,
        isLength: undefined,
      },
      preservation: {
        ...preservationSchema,
        optional: true,
        notEmpty: undefined,
        isLength: undefined,
      },
      description: {
        ...descriptionSchema,
        optional: true,
        notEmpty: undefined,
        isLength: undefined,
      },
      status: { ...statusSchema, optional: true, notEmpty: undefined },
      category_id: { ...category_idSchema, optional: true, notEmpty: undefined },
      ship_category_id: { ...shipCategoryIDSchema, optional: true, notEmpty: undefined },
      num_of_packs: { ...numOfPacksSchema, optional: true, notEmpty: undefined },
      images: { ...imageSchema, optional: true, notEmpty: undefined },
      price: { ...priceSchema, optional: true, notEmpty: undefined },
      sale_price: { ...salePriceSchema, optional: true, notEmpty: undefined },
      starting_timestamp: { ...startingTimestampSchema, optional: true, notEmpty: undefined },
      ending_timestamp: { ...endingTimestampSchema, optional: true, notEmpty: undefined },
    },
    ['body'],
  ),
);
export const priceValidator = validate(
  checkSchema(
    {
      price: {
        notEmpty: undefined,
        optional: true,
        isNumeric: {
          errorMessage: PRODUCT_MESSAGES.PRICE_MUST_BE_NUMBER,
        },
        custom: {
          options: (value, { req }) => {
            if (value && !req.body.starting_timestamp) {
              throw new Error(PRODUCT_MESSAGES.STARTING_TIMESTAMP_IS_REQUIRED);
            }
            return true;
          },
        },
      },
      sale_price: {
        notEmpty: undefined,
        optional: true,
        isNumeric: {
          errorMessage: PRODUCT_MESSAGES.SALE_PRICE_MUST_BE_NUMBER,
        },
      },
      starting_timestamp: {
        notEmpty: undefined,
        isISO8601: {
          errorMessage: PRODUCT_MESSAGES.STARTING_TIMESTAMP_MUST_BE_A_DATE,
        },
        optional: true,
        custom: {
          options: async (value, { req }) => {
            if (value && !req.body.price && !req.body.ending_timestamp) {
              throw new Error(PRODUCT_MESSAGES.PRICE_IS_REQUIRED);
            }

            if (!value && req.body.price && req.body.ending_timestamp) {
              throw new Error(PRODUCT_MESSAGES.STARTING_TIMESTAMP_IS_REQUIRED);
            }

            return true;
          },
        },
      },
      ending_timestamp: {
        notEmpty: undefined,
        optional: true,
        isISO8601: {
          errorMessage: PRODUCT_MESSAGES.STARTING_TIMESTAMP_MUST_BE_A_DATE,
        },
        custom: {
          options: async (value, { req }) => {
            if (value) {
              if (new Date(value) <= new Date(req.body.starting_timestamp)) {
                throw new Error(
                  PRODUCT_MESSAGES.ENDING_TIMESTAMP_MUST_BE_GREATER_THAN_STARTING_TIMESTAMP,
                );
              }
              if (!req.body.sale_price) {
                throw new Error(PRODUCT_MESSAGES.SALE_PRICE_IS_REQUIRED);
              }
            }
            return true;
          },
        },
      },
    },
    ['body'],
  ),
);
