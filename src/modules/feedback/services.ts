import { DatabaseInstance } from '~/database/database.services';
import { GiveFeedbackBodyReq } from './requests';

class FeedbackService {
  async createFeedback(feedback: GiveFeedbackBodyReq) {
    const result = await DatabaseInstance.getPrismaInstance().feedback.create({
      data: feedback,
    });

    return result;
  }
}
const feedbackService = new FeedbackService();
export default feedbackService;
