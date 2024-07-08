export interface GiveFeedbackBodyReq {
  user_id: string;
  order_detail_id: number;
  content?: string;
  rating_point: number;
}
