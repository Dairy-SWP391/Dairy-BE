export interface AddProductBodyReq {
  name: string;
  quantity: number;
  rating_number: number;
  rating_point: number;
  brand_id: number;
  origin?: string;
  producer?: string;
  manufactured_at?: string;
  target?: string;
  volume?: number;
  weight?: number;
  caution?: string;
  images: string[];
  preservation?: string;
  description?: string;
  instruction?: string;
  category_id: number;
  price: number;
  sale_price: number;
  starting_timestamp: Date;
  ending_timestamp?: Date;
}
export interface getProductsByCategorySortAndPaginateBodyReq {
  parent_category_id: number;
  category_id?: number;
  num_of_product: number;
  num_of_items_per_page?: number;
  page: number;
  sort_by?: string;
  order_by?: string;
}
