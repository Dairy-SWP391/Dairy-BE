import { DatabaseInstance } from '~/database/database.services';

class ProductService {
  async getProductDetail(id: number) {
    return await DatabaseInstance.getPrismaInstance().product.findUnique({
      where: {
        id,
      },
    });
  }
}

const productService = new ProductService();

export default productService;
