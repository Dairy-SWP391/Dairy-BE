import productPricingsService from '../product_pricings/service';
import { CartProduct, CartItemReqBody } from './schema';
import { DatabaseInstance } from '~/database/database.services';

class CartService {
  async getCart(payload: CartItemReqBody[]) {
    const products: CartProduct[] = [];
    await Promise.all(
      payload.map(async (item) => {
        const product = await DatabaseInstance.getPrismaInstance().product.findUnique({
          where: {
            id: item.id,
          },
          select: {
            id: true,
            name: true,
            quantity: true,
          },
        });
        if (product) {
          products.push(product);
        }
      }),
    );

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await DatabaseInstance.getPrismaInstance().image.findMany({
          where: {
            parent_id: product.id,
          },
          select: {
            image_url: true,
          },
        });
        const image_url = images.map((item) => item.image_url);
        return {
          ...product,
          image_url,
        };
      }),
    );
    const productsWithPriceDetails = await Promise.all(
      productsWithImages.map(async (product) => {
        const productPricing = await productPricingsService.getProductPrice(product.id);

        const { price, sale_price } = productPricing;
        return {
          ...product,
          price,
          sale_price,
        };
      }),
    );
    return {
      products: productsWithPriceDetails,
    };
  }
}
const cartService = new CartService();
export default cartService;
