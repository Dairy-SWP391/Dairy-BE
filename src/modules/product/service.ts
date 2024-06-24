import { DatabaseInstance } from '~/database/database.services';
import {
  AddProductBodyReq,
  ProductWithOtherFields,
  getProductsByCategorySortAndPaginateBodyReq,
} from './requests';
import { IMAGE_PARENT_TYPE } from '@prisma/client';
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
      brand_id,
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
    } = payload;

    const product = await DatabaseInstance.getPrismaInstance().product.create({
      data: {
        name,
        quantity,
        rating_number,
        rating_point,
        brand_id,
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
        price: payload.ending_timestamp ? payload.sale_price : payload.price,
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
      totalPage = Math.ceil(payload.num_of_product / payload.num_of_items_per_page);
      // nếu không có category_id thì lấy tất cả category
      if (!payload.category_id) {
        // nếu sắp xếp theo giá thì join với bảng product_pricing
        if (payload.sort_by === 'price') {
          const products = await this.getProductByParentCategoryIdAndSortByPrice(payload);
          if (products.length < payload.num_of_product) {
            totalPage = Math.ceil(products.length / payload.num_of_items_per_page);
          }
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
          if (products.length < payload.num_of_product) {
            totalPage = Math.ceil(products.length / payload.num_of_items_per_page);
          }
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
          if (products.length < payload.num_of_product) {
            totalPage = products.length / payload.num_of_items_per_page;
          }
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
          if (products.length < payload.num_of_product) {
            totalPage = products.length / payload.num_of_items_per_page;
          }
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
}

const productService = new ProductService();
export default productService;
