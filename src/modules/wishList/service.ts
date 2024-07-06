import { IMAGE_PARENT_TYPE } from '@prisma/client';
import productPricingsService from '../product_pricings/service';
import { DatabaseInstance } from '~/database/database.services';

class WishlistService {
  async getWishList(user_id: string, num_of_items_per_page: number, page: number) {
    const wishList = await DatabaseInstance.getPrismaInstance().wishList.findMany({
      where: {
        user_id,
      },
      select: {
        product_id: true,
        id: true,
      },

      orderBy: {
        id: 'desc',
      },
    });

    const products: any[] = [];

    await Promise.all(
      wishList.map(async (item) => {
        const product = await DatabaseInstance.getPrismaInstance().product.findUnique({
          where: {
            id: item.product_id,
          },
          include: {
            category: {
              select: {
                parent_category_id: true,
              },
            },
          },
        });
        products.push(product);
      }),
    );

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
      productsWithImages.map(async (product) => {
        const productPricing = await productPricingsService.getProductPrice(product.id);

        const { price, sale_price, starting_timestamp, ending_timestamp } = productPricing;

        const { category, ...rest } = product;
        return {
          ...rest,
          parent_category_id: category.parent_category_id,
          price,
          sale_price,
          starting_timestamp,
          ending_timestamp,
        };
      }),
    );
    let totalPage: number = 1;
    // có phân trang
    if (num_of_items_per_page) {
      totalPage = Math.ceil(productsWithPriceDetails.length / num_of_items_per_page);

      if (page > totalPage) {
        return { totalPage, products: [] };
      } else if (page == totalPage) {
        const skip = (page - 1) * num_of_items_per_page;
        const products = productsWithPriceDetails.splice(
          skip,
          productsWithPriceDetails.length - skip,
        );
        return { totalPage, products: products };
      } else {
        const skip = (page - 1) * num_of_items_per_page;
        const products = productsWithPriceDetails.splice(skip, num_of_items_per_page);
        return { totalPage, products: products };
      }
    } else if (page > 1) {
      return { totalPage, products: [] };
    }

    return { totalPage, products: productsWithPriceDetails };
  }

  async addProductToWishList(user_id: string, product_id: number) {
    return await DatabaseInstance.getPrismaInstance().wishList.create({
      data: {
        user_id,
        product_id,
      },
    });
  }

  async deleteProductFromWishList(user_id: string, product_id: number) {
    const product = await DatabaseInstance.getPrismaInstance().wishList.findFirst({
      where: {
        user_id,
        product_id,
      },
    });
    return await DatabaseInstance.getPrismaInstance().wishList.delete({
      where: {
        id: product?.id,
      },
    });
  }
}
const wishlistService = new WishlistService();
export default wishlistService;
