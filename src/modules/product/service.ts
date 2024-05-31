import { DatabaseInstance } from '~/database/database.services';
import { AddProductBodyReq } from './requests';
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
}

const productService = new ProductService();
export default productService;
