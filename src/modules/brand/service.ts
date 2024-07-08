import { DatabaseInstance } from '~/database/database.services';

class BrandService {
  async getBrandName(id: number) {
    return await DatabaseInstance.getPrismaInstance().brand.findUnique({
      where: {
        id,
      },
    });
  }

  async getAllBrand() {
    return await DatabaseInstance.getPrismaInstance().brand.findMany();
  }
}

const brandService = new BrandService();

export default brandService;
