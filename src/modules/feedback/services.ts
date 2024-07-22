import { DatabaseInstance } from '~/database/database.services';
import { GiveFeedbackBodyReq } from './requests';
import { FEEDBACK_MESSAGES } from './messages';

class FeedbackService {
  async createFeedback(feedback: GiveFeedbackBodyReq) {
    const { order_detail_id } = feedback;
    const order_detail = await DatabaseInstance.getPrismaInstance().orderDetail.findUnique({
      where: {
        id: order_detail_id,
      },
    });
    if (!order_detail) {
      throw new Error(FEEDBACK_MESSAGES.ORDER_DETAIL_NOT_FOUND);
    }
    const result = await DatabaseInstance.getPrismaInstance().feedback.create({
      data: { ...feedback, product_id: order_detail.product_id },
    });

    return result;
  }

  async getFeedbackByProductId(product_id: number) {
    // const result = await DatabaseInstance.getPrismaInstance().orderDetail.findMany({
    //   where: {
    //     product_id,
    //   },
    //   select: {
    //     id: true,
    //   },
    // });

    const rs = await DatabaseInstance.getPrismaInstance().feedback.findMany({
      where: {
        product_id: Number(product_id),
      },
      select: {
        user_id: true,
        content: true,
        rating_point: true,
        created_at: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
            avatar_url: true,
          },
        },
      },
    });

    return rs;
  }
}
const feedbackService = new FeedbackService();
export default feedbackService;
