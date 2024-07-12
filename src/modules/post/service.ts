import { IMAGE_PARENT_TYPE } from '@prisma/client';
import { AddPostReqBody } from './requests';

import { DatabaseInstance } from '~/database/database.services';
import { POST_MESSAGES } from './messages';
class PostService {
  async createPost(payload: AddPostReqBody, user_id: string) {
    // tạo post mới
    let post_category = await DatabaseInstance.getPrismaInstance().postCategory.findFirst({
      where: {
        name: payload.post_category,
      },
    });
    if (!post_category) {
      post_category = await DatabaseInstance.getPrismaInstance().postCategory.create({
        data: {
          name: payload.post_category,
        },
      });
    }
    const post = await DatabaseInstance.getPrismaInstance().post.create({
      data: {
        title: payload.title,
        content: payload.content,
        creator_id: user_id,
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
        post_category_id: post_category.id,
      },
    });
    return {
      ...post,
      images: images,
    };
  }

  async getPostDetail(post_id: string) {
    const post = await DatabaseInstance.getPrismaInstance().post.findUnique({
      where: {
        id: Number(post_id),
      },
    });
    if (!post) {
      throw new Error(POST_MESSAGES.POST_NOT_FOUND);
    }
    const category_by_post = await DatabaseInstance.getPrismaInstance().postByCategory.findFirst({
      where: {
        post_id: Number(post_id),
      },
    });
    if (!category_by_post) {
      throw new Error(POST_MESSAGES.POST_NOT_FOUND);
    }
    const category = await DatabaseInstance.getPrismaInstance().postCategory.findUnique({
      where: {
        id: category_by_post.post_category_id,
      },
    });
    if (!post) {
      throw new Error('Post not found');
    }

    const images = await DatabaseInstance.getPrismaInstance().image.findMany({
      where: {
        parent_id: post.id,
        parent_type: IMAGE_PARENT_TYPE.POST,
      },
    });

    return {
      ...post,
      images,
      category: category?.name,
      category_description: category?.description,
      category_id: category?.id,
    };
  }
}
const postService = new PostService();
export default postService;
