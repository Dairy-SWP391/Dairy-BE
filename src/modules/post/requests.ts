export interface AddPostReqBody {
  title: string;
  content: string;
  creator_id: string;
  images?: string[];
  post_category_id: number;
}
