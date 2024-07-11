import { DatabaseInstance } from '~/database/database.services';
import {
  AddProductBodyReq,
  ProductWithOtherFields,
  UpdateProductReqBody,
  getProductsByCategorySortAndPaginateBodyReq,
} from './requests';
import { IMAGE_PARENT_TYPE, products_status } from '@prisma/client';
import productPricingsService from '../product_pricings/service';

class ProductService {
  async getProductDetail(id: number) {
    return await DatabaseInstance.getPrismaInstance().product.findUnique({
      where: {
        id,
      },
    });
  }

  async addProduct(payload: AddProductBodyReq) {
    const {
      name,
      quantity,
      rating_number,
      rating_point,
      brand_name,
      origin,
      producer,
      manufactured_at,
      target,
      volume,
      weight,
      caution,
      preservation,
      description,
      instruction,
      category_id,
      ship_category_id,
      status,
    } = payload;

    let brand_id = await DatabaseInstance.getPrismaInstance().brand.findFirst({
      where: {
        name: brand_name,
      },
      select: {
        id: true,
      },
    });

    if (!brand_id) {
      brand_id = await DatabaseInstance.getPrismaInstance().brand.create({
        data: {
          name: brand_name,
        },
        select: {
          id: true,
        },
      });
    }

    const category = await DatabaseInstance.getPrismaInstance().category.findUnique({
      where: {
        id: Number(category_id),
      },
    });

    if (!category?.parent_category_id) {
      throw new Error('Category id is invalid');
    }

    const product = await DatabaseInstance.getPrismaInstance().product.create({
      data: {
        name,
        quantity: Number(quantity),
        rating_number,
        rating_point,
        brand_id: brand_id.id,
        origin,
        producer,
        manufactured_at,
        target,
        volume: Number(volume),
        weight: Number(weight),
        caution,
        preservation,
        description,
        instruction,
        category_id: Number(category_id),
        ship_category_id,
        status,
      },
    });

    await Promise.all(
      payload.images.map((image) => {
        return DatabaseInstance.getPrismaInstance().image.createMany({
          data: {
            parent_id: product.id,
            parent_type: IMAGE_PARENT_TYPE.PRODUCT,
            image_url: image,
          },
        });
      }),
    );
    await DatabaseInstance.getPrismaInstance().productPricing.create({
      data: {
        product_id: product.id,
        price: payload.ending_timestamp ? Number(payload.sale_price) : Number(payload.price),
        starting_timestamp: payload.starting_timestamp,
        ending_timestamp: payload.ending_timestamp,
      },
    });

    return product;
  }

  async getProductByCategorySortingAndPaginate(
    payload: getProductsByCategorySortAndPaginateBodyReq,
  ) {
    // {
    //   "category_id": 6,
    //   "num_of_product": 5,
    //   "num_of_items_per_page": 2,
    //   "page": 3,
    //   "sort_by": "rating_point",
    //   "order_by": "DESC"
    // }
    let totalPage: number = 1;
    // nếu có items_per_page thì phân trang
    if (payload.num_of_items_per_page) {
      // lấy tổng số trang
      // nếu không có category_id thì lấy tất cả category
      if (!payload.category_id) {
        // nếu sắp xếp theo giá thì join với bảng product_pricing
        if (payload.sort_by === 'price') {
          const products = await this.getProductByParentCategoryIdAndSortByPrice(payload);
          // if (products.length < payload.num_of_product) {
          //   totalPage = Math.ceil(products.length / payload.num_of_items_per_page);
          // }
          totalPage = Math.ceil(products.length / payload.num_of_items_per_page);
          if (payload.page === totalPage) {
            // nếu là trang cuối cùng thì lấy hết số sản phẩm còn lại
            const skip = (payload.page - 1) * payload.num_of_items_per_page;
            const res = products.splice(skip, payload.num_of_product - skip);
            return { totalPage, products: res };
          } else if (payload.page < totalPage) {
            // nếu không phải trang cuối cùng thì lấy số sản phẩm theo số sản phẩm trên 1 trang
            const skip = (payload.page - 1) * payload.num_of_items_per_page;
            const res = products.splice(skip, payload.num_of_items_per_page);
            return { totalPage, products: res };
          } else {
            // nếu page > tổng số trang thì trả về rỗng
            return { totalPage, products: [] };
          }
        } else if (payload.sort_by === 'discount') {
          // giảm giá
          const products = await this.getProductByParentCategoryIdAndSortByDiscount(payload);
          // if (products.length < payload.num_of_product) {
          //   totalPage = Math.ceil(products.length / payload.num_of_items_per_page);
          // }
          totalPage = Math.ceil(products.length / payload.num_of_items_per_page);
          if (payload.page == totalPage) {
            // nếu là trang cuối cùng thì lấy hết số sản phẩm còn lại
            const skip = (payload.page - 1) * payload.num_of_items_per_page;
            const res = products.splice(skip, payload.num_of_product - skip);
            return { totalPage, products: res };
          } else if (payload.page < totalPage) {
            // nếu không phải trang cuối cùng thì lấy số sản phẩm theo số sản phẩm trên 1 trang
            const skip = (payload.page - 1) * payload.num_of_items_per_page;
            const res = products.splice(skip, payload.num_of_items_per_page);
            return { totalPage, products: res };
          } else {
            // nếu page > tổng số trang thì trả về rỗng
            return { totalPage, products: [] };
          }
        } else {
          // nếu không sắp xếp theo giá thì không join với bảng product_pricing
          // sắp xếp theo rating_point | sold | id
          const products =
            await this.getProductByParentCategoryIdAndSortByRatingPoint_Sold_ID(payload);
          // if (products.length < payload.num_of_product) {
          //   totalPage = Math.ceil(products.length / payload.num_of_items_per_page);
          // }
          totalPage = Math.ceil(products.length / payload.num_of_items_per_page);
          if (payload.page == totalPage) {
            // nếu là trang cuối cùng thì lấy hết số sản phẩm còn lại
            const skip = (payload.page - 1) * payload.num_of_items_per_page;
            const res = products.splice(skip, payload.num_of_product - skip);
            return { totalPage, products: res };
          } else if (payload.page < totalPage) {
            // nếu không phải trang cuối cùng thì lấy số sản phẩm theo số sản phẩm trên 1 trang
            const skip = (payload.page - 1) * payload.num_of_items_per_page;
            const res = products.splice(skip, payload.num_of_items_per_page);
            return { totalPage, products: res };
          } else {
            // nếu page > tổng số trang thì trả về rỗng
            return { totalPage, products: [] };
          }
        }
      } else {
        // nếu có category_id thì lấy theo category_id
        if (payload.sort_by === 'price') {
          // nếu sắp xếp theo giá thì join với bảng product_pricing
          const products = await this.getProductByCategoryIDAndSortByPrice(payload);
          // if (products.length < payload.num_of_product) {
          //   totalPage = Math.ceil(products.length / payload.num_of_items_per_page);
          // }
          totalPage = Math.ceil(products.length / payload.num_of_items_per_page);
          if (payload.page == totalPage) {
            // nếu là trang cuối cùng thì lấy hết số sản phẩm còn lại
            const skip = (payload.page - 1) * payload.num_of_items_per_page;
            const res = products.splice(skip, payload.num_of_product - skip);
            return { totalPage, products: res };
          } else if (payload.page < totalPage) {
            // nếu không phải trang cuối cùng thì lấy số sản phẩm theo số sản phẩm trên 1 trang
            const skip = (payload.page - 1) * payload.num_of_items_per_page;
            const res = products.splice(skip, payload.num_of_items_per_page);
            return { totalPage, products: res };
          } else {
            // nếu page > tổng số trang thì trả về rỗng
            return { totalPage, products: [] };
          }
        } else if (payload.sort_by === 'discount') {
          // giảm giá
          const products = await this.getProductByCategoryIDAndSortByDiscount(payload);
          if (products.length < payload.num_of_product) {
            totalPage = products.length / payload.num_of_items_per_page;
          }
          if (payload.page == totalPage) {
            const skip = (payload.page - 1) * payload.num_of_items_per_page;
            const res = products.splice(skip, payload.num_of_product - skip);
            return { totalPage, products: res };
          } else if (payload.page < totalPage) {
            const skip = (payload.page - 1) * payload.num_of_items_per_page;
            const res = products.splice(skip, payload.num_of_items_per_page);
            return { totalPage, products: res };
          } else {
            return { totalPage, products: [] };
          }
        } else {
          // nếu không sắp xếp theo giá thì không join với bảng product_pricing
          // sắp xếp theo rating_point | sold | id
          const products = await this.getProductByCategoryIDAndSortByRatingPoint_Sold_ID(payload);
          // if (products.length < payload.num_of_product) {
          //   totalPage = Math.ceil(products.length / payload.num_of_items_per_page);
          // }
          totalPage = Math.ceil(products.length / payload.num_of_items_per_page);
          if (payload.page == totalPage) {
            const skip = (payload.page - 1) * payload.num_of_items_per_page;
            const res = products.splice(skip, payload.num_of_product - skip);
            return { totalPage, products: res };
          } else if (payload.page < totalPage) {
            const skip = (payload.page - 1) * payload.num_of_items_per_page;
            const res = products.splice(skip, payload.num_of_items_per_page);
            return { totalPage, products: res };
          } else {
            return { totalPage, products: [] };
          }
        }
      }
    } else {
      if (payload.page > 1) {
        return { totalPage, products: [] };
      }
      // nếu không có items_per_page thì không phân trang
      if (!payload.category_id) {
        // nếu không có category_id thì lấy tất cả category
        if (payload.sort_by === 'price') {
          const products = await this.getProductByParentCategoryIdAndSortByPrice(payload);

          if (payload.num_of_product < products.length) {
            const res = products.slice(0, payload.num_of_product);
            return { totalPage, products: res };
          }
          return { totalPage, products };
        } else if (payload.sort_by === 'discount') {
          const products = await this.getProductByParentCategoryIdAndSortByDiscount(payload);
          if (payload.num_of_product < products.length) {
            const res = products.slice(0, payload.num_of_product);
            return { totalPage, products: res };
          }
          return { totalPage, products };
        } else {
          // nếu không sắp xếp theo giá thì không join với bảng product_pricing
          const products =
            await this.getProductByParentCategoryIdAndSortByRatingPoint_Sold_ID(payload);
          if (payload.num_of_product < products.length) {
            const res = products.slice(0, payload.num_of_product);
            return { totalPage, products: res };
          }
          return { totalPage, products };
        }
      } else {
        // nếu có category_id thì lấy theo category_id
        if (payload.sort_by === 'price') {
          const products = await this.getProductByCategoryIDAndSortByPrice(payload);
          if (payload.num_of_product < products.length) {
            const res = products.slice(0, payload.num_of_product);
            return { totalPage, products: res };
          }
          return { totalPage, products };
        } else if (payload.sort_by === 'discount') {
          const products = await this.getProductByCategoryIDAndSortByDiscount(payload);

          if (payload.num_of_product < products.length) {
            const res = products.slice(0, payload.num_of_product);
            return { totalPage, products: res };
          }
          return { totalPage, products: products };
        } else {
          // nếu không sắp xếp theo giá thì không join với bảng product_pricing
          const products = await this.getProductByCategoryIDAndSortByRatingPoint_Sold_ID(payload);

          if (payload.num_of_product < products.length) {
            const res = products.slice(0, payload.num_of_product);
            return { totalPage, products: res };
          }
          return { totalPage, products };
        }
      }
    }
  }

  async getProductByParentCategoryIdAndSortByPrice(
    payload: getProductsByCategorySortAndPaginateBodyReq,
  ) {
    const products = await DatabaseInstance.getPrismaInstance().product.findMany({
      where: {
        category: {
          parent_category_id:
            payload.parent_category_id !== 0
              ? payload.parent_category_id
              : {
                  not: null,
                },
        },
      },
      include: {
        ProductPricing: {
          distinct: ['product_id'],
          orderBy: [
            {
              starting_timestamp: 'desc',
            },
          ],

          select: {
            price: true,
          },
        },
        category: {
          select: {
            parent_category_id: true,
          },
        },
      },
    });
    if (payload.order_by === 'ASC' || !payload.order_by) {
      products.sort((a, b) => a.ProductPricing[0].price - b.ProductPricing[0].price);
    } else {
      products.sort((a, b) => b.ProductPricing[0].price - a.ProductPricing[0].price);
    }

    const productsWithPriceDetails = await Promise.all(
      products.map(async (item) => {
        const productPricing = await productPricingsService.getProductPrice(item.id);

        const { price, sale_price, starting_timestamp, ending_timestamp } = productPricing;
        return {
          ...item,
          parent_category_id: item.category.parent_category_id,
          price,
          sale_price,
          starting_timestamp,
          ending_timestamp,
        };
      }),
    );

    const productsWithParentCategoryId = productsWithPriceDetails.map((product) => {
      const { category, ...rest } = product;
      return {
        ...rest,
        parent_category_id: category.parent_category_id,
      };
    });
    return this.getProductWithImages(productsWithParentCategoryId);
  }

  async getProductByParentCategoryIdAndSortByRatingPoint_Sold_ID(
    payload: getProductsByCategorySortAndPaginateBodyReq,
  ) {
    const products = await DatabaseInstance.getPrismaInstance().product.findMany({
      where: {
        category: {
          parent_category_id:
            payload.parent_category_id !== 0
              ? payload.parent_category_id
              : {
                  not: null,
                },
        },
      },
      include: {
        ProductPricing: {
          distinct: ['product_id'],
          orderBy: [
            {
              starting_timestamp: 'desc',
            },
          ],
          select: {
            price: true,
          },
        },
        category: {
          select: {
            parent_category_id: true,
          },
        },
      },
      orderBy: {
        [payload.sort_by || 'id']: payload.order_by === 'DESC' ? 'desc' : 'asc',
      },
    });

    const productsWithPriceDetails = await Promise.all(
      products.map(async (item) => {
        const productPricing = await productPricingsService.getProductPrice(item.id);

        const { price, sale_price, starting_timestamp, ending_timestamp } = productPricing;
        return {
          ...item,
          parent_category_id: item.category.parent_category_id,
          price,
          sale_price,
          starting_timestamp,
          ending_timestamp,
        };
      }),
    );
    const productsWithParentCategoryId = productsWithPriceDetails.map((product) => {
      const { category, ...rest } = product;
      return {
        ...rest,
        parent_category_id: category.parent_category_id,
      };
    });
    return this.getProductWithImages(productsWithParentCategoryId);
  }

  async getProductByCategoryIDAndSortByPrice(payload: getProductsByCategorySortAndPaginateBodyReq) {
    const products = await DatabaseInstance.getPrismaInstance().product.findMany({
      where: {
        category: {
          id: payload.category_id,
        },
      },
      include: {
        ProductPricing: {
          distinct: ['product_id'],
          orderBy: [
            {
              starting_timestamp: 'desc',
            },
          ],
          select: {
            price: true,
          },
        },
        category: {
          select: {
            parent_category_id: true,
          },
        },
      },
    });
    if (payload.order_by === 'ASC' || !payload.order_by) {
      products.sort((a, b) => a.ProductPricing[0].price - b.ProductPricing[0].price);
    } else {
      products.sort((a, b) => b.ProductPricing[0].price - a.ProductPricing[0].price);
    }

    const productsWithPriceDetails = await Promise.all(
      products.map(async (item) => {
        const productPricing = await productPricingsService.getProductPrice(item.id);

        const { price, sale_price, starting_timestamp, ending_timestamp } = productPricing;
        return {
          ...item,
          parent_category_id: item.category.parent_category_id,
          price,
          sale_price,
          starting_timestamp,
          ending_timestamp,
        };
      }),
    );

    const productsWithParentCategoryId = productsWithPriceDetails.map((product) => {
      const { category, ...rest } = product;
      return {
        ...rest,
        parent_category_id: category.parent_category_id,
      };
    });

    return this.getProductWithImages(productsWithParentCategoryId);
  }

  async getProductByCategoryIDAndSortByRatingPoint_Sold_ID(
    payload: getProductsByCategorySortAndPaginateBodyReq,
  ) {
    const products = await DatabaseInstance.getPrismaInstance().product.findMany({
      where: {
        category: {
          id: payload.category_id,
        },
      },
      orderBy: {
        [payload.sort_by || 'id']: payload.order_by === 'DESC' ? 'desc' : 'asc',
      },
      include: {
        ProductPricing: {
          distinct: ['product_id'],
          orderBy: [
            {
              starting_timestamp: 'desc',
            },
          ],
          select: {
            price: true,
          },
        },
        category: {
          select: {
            parent_category_id: true,
          },
        },
      },
    });

    const productsWithPriceDetails = await Promise.all(
      products.map(async (item) => {
        const productPricing = await productPricingsService.getProductPrice(item.id);

        const { price, sale_price, starting_timestamp, ending_timestamp } = productPricing;
        return {
          ...item,
          parent_category_id: item.category.parent_category_id,
          price,
          sale_price,
          starting_timestamp,
          ending_timestamp,
        };
      }),
    );
    const productsWithParentCategoryId = productsWithPriceDetails.map((product) => {
      const { category, ...rest } = product;
      return {
        ...rest,
        parent_category_id: category.parent_category_id,
      };
    });

    return this.getProductWithImages(productsWithParentCategoryId);
  }

  async getProductWithImages(products: ProductWithOtherFields[]) {
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await DatabaseInstance.getPrismaInstance().image.findMany({
          where: {
            parent_id: product.id,
            parent_type: IMAGE_PARENT_TYPE.PRODUCT,
          },
          select: {
            image_url: true,
          },
        });

        const imageUrls = images.map((image) => image.image_url);

        return {
          ...product,
          image_urls: imageUrls, // Thêm một trường mới chứa các URL hình ảnh
        };
      }),
    );
    return productsWithImages;
  }

  async getProductByCategoryIDAndSortByDiscount(
    payload: getProductsByCategorySortAndPaginateBodyReq,
  ) {
    const products = await DatabaseInstance.getPrismaInstance().product.findMany({
      where: {
        category: {
          id: payload.category_id,
        },
      },
      include: {
        ProductPricing: {
          distinct: ['product_id'],
          orderBy: [
            {
              starting_timestamp: 'desc',
            },
          ],
          select: {
            price: true,
          },
        },
        category: {
          select: {
            parent_category_id: true,
          },
        },
      },
    });

    const productsWithPriceDetails = await Promise.all(
      products.map(async (item) => {
        const productPricing = await productPricingsService.getProductPrice(item.id);

        const { price, sale_price, starting_timestamp, ending_timestamp } = productPricing;
        return {
          ...item,
          parent_category_id: item.category.parent_category_id,
          price,
          sale_price,
          starting_timestamp,
          ending_timestamp,
        };
      }),
    );

    const productsWithParentCategoryId = productsWithPriceDetails.map((product) => {
      const { category, ...rest } = product;
      return {
        ...rest,
        parent_category_id: category.parent_category_id,
      };
    });

    const discounts: number[] = [];

    await Promise.all(
      productsWithParentCategoryId.map(async (product) => {
        if (product.price && typeof product.price !== 'undefined') {
          const discount = product.sale_price
            ? ((product.price - product.sale_price) / product.price) * 100
            : 0;

          discounts.push(discount);
        }
      }),
    );
    if (payload.order_by === 'ASC' || !payload.order_by) {
      productsWithParentCategoryId.sort((a, b) => {
        const discountA = discounts[productsWithParentCategoryId.indexOf(a)];
        const discountB = discounts[productsWithParentCategoryId.indexOf(b)];
        return discountA - discountB;
      });
    } else
      productsWithParentCategoryId.sort((a, b) => {
        const discountA = discounts[productsWithParentCategoryId.indexOf(a)];
        const discountB = discounts[productsWithParentCategoryId.indexOf(b)];
        return discountB - discountA;
      });

    return this.getProductWithImages(productsWithParentCategoryId);
  }

  async getProductByParentCategoryIdAndSortByDiscount(
    payload: getProductsByCategorySortAndPaginateBodyReq,
  ) {
    const products = await DatabaseInstance.getPrismaInstance().product.findMany({
      where: {
        category: {
          parent_category_id:
            payload.parent_category_id !== 0
              ? payload.parent_category_id
              : {
                  not: null,
                },
        },
      },
      include: {
        ProductPricing: {
          distinct: ['product_id'],
          orderBy: [
            {
              starting_timestamp: 'desc',
            },
          ],

          select: {
            price: true,
          },
        },
        category: {
          select: {
            parent_category_id: true,
          },
        },
      },
    });

    const productsWithPriceDetails = await Promise.all(
      products.map(async (item) => {
        const productPricing = await productPricingsService.getProductPrice(item.id);

        const { price, sale_price, starting_timestamp, ending_timestamp } = productPricing;
        return {
          ...item,
          parent_category_id: item.category.parent_category_id,
          price,
          sale_price,
          starting_timestamp,
          ending_timestamp,
        };
      }),
    );

    const productsWithParentCategoryId = productsWithPriceDetails.map((product) => {
      const { category, ...rest } = product;
      return {
        ...rest,
        parent_category_id: category.parent_category_id,
      };
    });
    const discounts: number[] = [];

    await Promise.all(
      productsWithParentCategoryId.map(async (product) => {
        if (product.price && typeof product.price !== 'undefined') {
          const discount = product.sale_price
            ? ((product.price - product.sale_price) / product.price) * 100
            : 0;

          discounts.push(discount);
        }
      }),
    );
    if (payload.order_by === 'ASC' || !payload.order_by) {
      productsWithParentCategoryId.sort((a, b) => {
        const discountA = discounts[productsWithParentCategoryId.indexOf(a)];
        const discountB = discounts[productsWithParentCategoryId.indexOf(b)];
        return discountA - discountB;
      });
    } else
      productsWithParentCategoryId.sort((a, b) => {
        const discountA = discounts[productsWithParentCategoryId.indexOf(a)];
        const discountB = discounts[productsWithParentCategoryId.indexOf(b)];
        return discountB - discountA;
      });
    return this.getProductWithImages(productsWithParentCategoryId);
  }

  async searchProduct(search: string, num_of_items_per_page: number, page: number) {
    const products = await DatabaseInstance.getPrismaInstance().product.findMany({
      where: {
        name: {
          contains: search,
        },
      },
      include: {
        category: {
          select: {
            parent_category_id: true,
          },
        },
      },
    });

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await DatabaseInstance.getPrismaInstance().image.findMany({
          where: {
            parent_id: product.id,
            parent_type: IMAGE_PARENT_TYPE.PRODUCT,
          },
          select: {
            image_url: true,
          },
        });

        const imageUrls = images.map((image) => image.image_url);

        return {
          ...product,
          image_urls: imageUrls,
        };
      }),
    );
    const productsWithPriceDetails = await Promise.all(
      productsWithImages.map(async (item) => {
        const productPricing = await productPricingsService.getProductPrice(item.id);

        const { price, sale_price, starting_timestamp, ending_timestamp } = productPricing;
        return {
          ...item,
          parent_category_id: item.category.parent_category_id,
          price,
          sale_price,
          starting_timestamp,
          ending_timestamp,
        };
      }),
    );
    const productsWithParentCategoryId = productsWithPriceDetails.map((product) => {
      const { category, ...rest } = product;
      return {
        ...rest,
        parent_category_id: category.parent_category_id,
      };
    });
    let totalPage: number = 1;
    // có phân trang
    if (num_of_items_per_page) {
      totalPage = Math.ceil(productsWithParentCategoryId.length / num_of_items_per_page);

      if (page > totalPage) {
        return { totalPage, products: [] };
      } else if (page == totalPage) {
        const skip = (page - 1) * num_of_items_per_page;
        const products = productsWithParentCategoryId.splice(
          skip,
          productsWithParentCategoryId.length - skip,
        );
        return { totalPage, products: products };
      } else {
        const skip = (page - 1) * num_of_items_per_page;
        const products = productsWithParentCategoryId.splice(skip, num_of_items_per_page);
        return { totalPage, products: products };
      }
    } else if (page > 1) {
      return { totalPage, products: [] };
    }

    return { totalPage, products: productsWithParentCategoryId };
  }

  async deleteProduct(id: number) {
    await DatabaseInstance.getPrismaInstance().productPricing.deleteMany({
      where: {
        product_id: id,
      },
    });
    await DatabaseInstance.getPrismaInstance().image.deleteMany({
      where: {
        parent_id: id,
        parent_type: IMAGE_PARENT_TYPE.PRODUCT,
      },
    });
    const product = await DatabaseInstance.getPrismaInstance().product.delete({
      where: {
        id,
      },
    });

    return product;
  }

  async updateProduct(payload: UpdateProductReqBody) {
    const product = await DatabaseInstance.getPrismaInstance().product.update({
      where: {
        id: payload.id,
      },
      data: {
        name: payload.name,
        quantity: payload.quantity,
        rating_number: payload.rating_number,
        rating_point: payload.rating_point,
        brand_id: payload.brand_id,
        origin: payload.origin,
        producer: payload.producer,
        manufactured_at: payload.manufactured_at,
        target: payload.target,
        volume: payload.volume,
        weight: payload.weight,
        sold: payload.sold,
        caution: payload.caution,
        instruction: payload.instruction,
        preservation: payload.preservation,
        description: payload.description,
        status: payload.status === 'ACTIVE' ? products_status.ACTIVE : products_status.INACTIVE,
        category_id: payload.category_id,
        num_of_packs: payload.num_of_packs,
        ship_category_id: payload.ship_category_id,
      },
    });

    interface image_type {
      id: number;
      parent_type: string;
      image_url: string;
    }
    let image_urls: image_type[] = [];
    if (payload.images && payload.images?.length > 0) {
      await DatabaseInstance.getPrismaInstance().image.deleteMany({
        where: {
          parent_id: payload.id,
          parent_type: IMAGE_PARENT_TYPE.PRODUCT,
        },
      });
      image_urls = await Promise.all(
        payload.images.map((image) => {
          return DatabaseInstance.getPrismaInstance().image.create({
            data: {
              parent_id: payload.id,
              parent_type: IMAGE_PARENT_TYPE.PRODUCT,
              image_url: image,
            },
            select: {
              id: true,
              parent_type: true,
              image_url: true,
            },
          });
        }),
      );
    }

    interface PricingType {
      price: number;
      starting_timestamp: Date;
      ending_timestamp: Date | null;
    }
    let product_pricing: PricingType | {} = {};

    // giá không sale
    if (payload.starting_timestamp && !payload.ending_timestamp) {
      // tìm ra giá không sale với starting_timestamp gốc để update
      const p = await DatabaseInstance.getPrismaInstance().productPricing.findFirst({
        where: {
          product_id: payload.id,
          ending_timestamp: null,
        },
        orderBy: {
          starting_timestamp: 'desc',
        },
      });

      if (p) {
        // nếu tìm thấy
        // tìm xem sản phẩm có giá sale cùng ngày không
        const sale_price = await DatabaseInstance.getPrismaInstance().productPricing.findFirst({
          where: {
            product_id: payload.id,
            NOT: {
              ending_timestamp: null,
            },
          },
          orderBy: {
            starting_timestamp: 'desc',
          },
        });

        if (sale_price) {
          if (
            sale_price.starting_timestamp.getTime() ===
            new Date(payload.starting_timestamp).getTime()
          ) {
            throw new Error('Starting timestamp is duplicated');
          }
        }

        product_pricing = await DatabaseInstance.getPrismaInstance().productPricing.update({
          where: {
            product_id_starting_timestamp: {
              product_id: payload.id,
              starting_timestamp: p.starting_timestamp,
            },
          },
          data: {
            price: payload.price,
            starting_timestamp: payload.starting_timestamp,
          },
        });
      }
    } else if (payload.starting_timestamp && payload.ending_timestamp) {
      // cập nhật giá sale mới
      const p = await DatabaseInstance.getPrismaInstance().productPricing.findFirst({
        where: {
          product_id: payload.id,
          NOT: {
            ending_timestamp: null,
          },
        },
        orderBy: {
          starting_timestamp: 'desc',
        },
      });

      const no_sale = await DatabaseInstance.getPrismaInstance().productPricing.findFirst({
        where: {
          product_id: payload.id,
          ending_timestamp: null,
        },
        orderBy: {
          starting_timestamp: 'desc',
        },
      });

      if (p) {
        if (payload.starting_timestamp) {
          const payloadStartingTimestamp = new Date(payload.starting_timestamp);

          if (no_sale?.starting_timestamp.getTime() === payloadStartingTimestamp.getTime()) {
            throw new Error('Starting timestamp is duplicated');
          }
        }

        product_pricing = await DatabaseInstance.getPrismaInstance().productPricing.update({
          where: {
            product_id_starting_timestamp: {
              product_id: p.product_id,
              starting_timestamp: p.starting_timestamp,
            },
          },
          data: {
            price: payload.sale_price,
            starting_timestamp: payload.starting_timestamp,
            ending_timestamp: payload.ending_timestamp,
          },
        });
      }
    } else {
      product_pricing = {};
    }

    return { ...product, ...product_pricing, images: image_urls };
  }
}

const productService = new ProductService();
export default productService;
