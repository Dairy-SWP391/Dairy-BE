import { DatabaseInstance } from '~/database/database.services';

class BrandService {
  async getBrandName(id: number) {
    return await DatabaseInstance.getPrismaInstance().brand.findUnique({
      where: {
        id,
      },
    });
  }
}

const brandService = new BrandService();

export default brandService;
