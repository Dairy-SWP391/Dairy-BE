import { DatabaseInstance } from '~/database/database.services';
import { AddProductBodyReq, getProductsByCategorySortAndPaginateBodyReq } from './requests';
import { IMAGE_PARENT_TYPE } from '@prisma/client';

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

    // nếu có items_per_page thì phân trang
    if (payload.num_of_items_per_page) {
      const totalPage = Math.ceil(payload.num_of_product / payload.num_of_items_per_page);
      // nếu sắp xếp theo giá thì join với bảng product_pricing
      if (payload.sort_by === 'price') {
        const products = await DatabaseInstance.getPrismaInstance().product.findMany({
          where: {
            category_id: payload.category_id,
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
          },
        });

        if (payload.order_by === 'ASC' || !payload.order_by) {
          products.sort((a, b) => a.ProductPricing[0].price - b.ProductPricing[0].price);
        } else {
          products.sort((a, b) => b.ProductPricing[0].price - a.ProductPricing[0].price);
        }

        if (payload.page === totalPage) {
          // nếu là trang cuối cùng thì lấy hết số sản phẩm còn lại
          const skip = (payload.page - 1) * payload.num_of_items_per_page;
          const res = products.splice(skip, payload.num_of_product - skip);
          return res;
        } else if (payload.page < totalPage) {
          const skip = (payload.page - 1) * payload.num_of_items_per_page;
          const res = products.splice(skip, payload.num_of_items_per_page);
          return res;
        } else {
          return [];
        }
      } else {
        // nếu không sắp xếp theo giá thì không join với bảng product_pricing
        const products = await DatabaseInstance.getPrismaInstance().product.findMany({
          where: {
            category_id: payload.category_id,
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
          },
          orderBy: {
            [payload.sort_by || 'id']: payload.order_by === 'DESC' ? 'desc' : 'asc',
          },
        });

        if (payload.page == totalPage) {
          // nếu là trang cuối cùng thì lấy hết số sản phẩm còn lại
          const skip = (payload.page - 1) * payload.num_of_items_per_page;
          const res = products.splice(skip, payload.num_of_product - skip);
          return res;
        } else if (payload.page < totalPage) {
          const skip = (payload.page - 1) * payload.num_of_items_per_page;
          const res = products.splice(skip, payload.num_of_items_per_page);
          return res;
        } else {
          return [];
        }
      }
    } else {
      // nếu không có items_per_page thì không phân trang
      if (payload.sort_by === 'price') {
        const products = await DatabaseInstance.getPrismaInstance().product.findMany({
          where: {
            category_id: payload.category_id,
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
          },
        });

        if (payload.order_by === 'ASC' || !payload.order_by) {
          products.sort((a, b) => a.ProductPricing[0].price - b.ProductPricing[0].price);
        } else {
          products.sort((a, b) => b.ProductPricing[0].price - a.ProductPricing[0].price);
        }

        if (payload.num_of_product < products.length) {
          return products.slice(0, payload.num_of_product);
        }
        return products;
      } else {
        const products = await DatabaseInstance.getPrismaInstance().product.findMany({
          where: {
            category_id: payload.category_id,
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
          },
        });

        if (payload.num_of_product < products.length) {
          return products.slice(0, payload.num_of_product);
        }
        return products;
      }
    }
  }
}

const productService = new ProductService();
export default productService;
