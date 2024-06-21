import { IMAGE_PARENT_TYPE } from '@prisma/client';
import { AddPostReqBody } from './requests';

import { DatabaseInstance } from '~/database/database.services';
class PostService {
  async createPost(payload: AddPostReqBody) {
    // tạo post mới
    const post = await DatabaseInstance.getPrismaInstance().post.create({
      data: {
        title: payload.title,
        content: payload.content,
        creator_id: payload.creator_id,
      },
    });
    if (payload.images !== undefined) {
      await Promise.all(
        payload.images.map((image) => {
          return DatabaseInstance.getPrismaInstance().image.createMany({
            data: {
              parent_id: post.id,
              parent_type: IMAGE_PARENT_TYPE.POST,
              image_url: image,
            },
          });
        }),
      );
    }
    const images = await DatabaseInstance.getPrismaInstance().image.findMany({
      where: {
        parent_id: post.id,
        parent_type: IMAGE_PARENT_TYPE.POST,
      },
      select: {
        id: true,
        parent_id: true,
        parent_type: true,
        image_url: true,
      },
    });
    await DatabaseInstance.getPrismaInstance().postByCategory.create({
      data: {
        post_id: post.id,
        post_category_id: payload.post_category_id,
      },
    });
    return {
      ...post,
      images: images,
    };
  }
}
const postService = new PostService();
export default postService;
