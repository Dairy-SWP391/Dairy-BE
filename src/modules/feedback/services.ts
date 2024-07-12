import { DatabaseInstance } from '~/database/database.services';
import { GiveFeedbackBodyReq } from './requests';

class FeedbackService {
  async createFeedback(feedback: GiveFeedbackBodyReq) {
    const result = await DatabaseInstance.getPrismaInstance().feedback.create({
      data: feedback,
    });

    return result;
  }

  async getFeedbackByProductId(product_id: number) {
    const result = await DatabaseInstance.getPrismaInstance().orderDetail.findMany({
      where: {
        product_id,
      },
      select: {
        id: true,
      },
    });

    const rs = await DatabaseInstance.getPrismaInstance().feedback.findMany({
      where: {
        order_detail_id: {
          in: result.map((item) => item.id),
        },
      },
      select: {
        user_id: true,
        content: true,
        rating_point: true,
        created_at: true,
      },
    });

    return rs;
  }
}
const feedbackService = new FeedbackService();
export default feedbackService;
