import { IMAGE_PARENT_TYPE } from '@prisma/client';
import productPricingsService from '../product_pricings/service';
import { DatabaseInstance } from '~/database/database.services';

class WishlistService {
  async getWishList(user_id: string) {
    const wishList = await DatabaseInstance.getPrismaInstance().wishList.findMany({
      where: {
        user_id,
      },
      select: {
        product_id: true,
      },
    });

    const products = await DatabaseInstance.getPrismaInstance().product.findMany({
      where: {
        id: {
          in: wishList.map((product) => product.product_id),
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

    return productsWithPriceDetails;
  }

  async addProductToWishList(user_id: string, product_id: number) {
    return await DatabaseInstance.getPrismaInstance().wishList.create({
      data: {
        user_id,
        product_id,
      },
    });
  }
}
const wishlistService = new WishlistService();
export default wishlistService;
