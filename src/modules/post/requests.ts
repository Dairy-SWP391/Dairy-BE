export interface AddPostReqBody {
  title: string;
  creator_id: string;
  images?: string[];
  content: string;
  // post_category_id: number;
  post_category: string;
}
