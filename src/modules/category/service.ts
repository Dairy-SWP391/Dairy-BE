import { DatabaseInstance } from '~/database/database.services';

class CategoryService {
  async getAllCategories() {
    const result = await DatabaseInstance.getPrismaInstance().category.findMany();
    return result;
  }
}

const categoryService = new CategoryService();

export default categoryService;
