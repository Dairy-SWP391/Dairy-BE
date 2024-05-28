import { DatabaseInstance } from '~/database/database.services';

class ProductPricingsService {
  async getProductPrice(id: number) {
    const sale_price = await DatabaseInstance.getPrismaInstance().productPricing.findFirst({
      where: {
        product_id: id,
      },
      orderBy: {
        starting_timestamp: 'desc',
      },
    });
    if (!sale_price?.ending_timestamp)
      return {
        price: sale_price?.price,
        sale_price: null,
        starting_timestamp: null,
        ending_timestamp: null,
      };
    else {
      const base_price = await DatabaseInstance.getPrismaInstance().productPricing.findFirst({
        where: {
          product_id: id,
          ending_timestamp: null,
        },
        orderBy: {
          starting_timestamp: 'desc',
        },
      });
      return {
        price: base_price?.price,
        sale_price: sale_price?.price,
        starting_timestamp: sale_price?.starting_timestamp,
        ending_timestamp: sale_price?.ending_timestamp,
      };
    }
  }
}

const productPricingsService = new ProductPricingsService();

export default productPricingsService;
