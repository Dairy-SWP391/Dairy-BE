import { DatabaseInstance } from '~/database/database.services';

class ImageService {
  async getProductImages(productId: number) {
    return await DatabaseInstance.getPrismaInstance().image.findMany({
      where: {
        parent_id: productId,
      },
    });
  }
}

const imageService = new ImageService();

export default imageService;
