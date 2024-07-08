import { SHIP_CATEGORY_ID } from '@prisma/client';

export interface AddProductBodyReq {
  name: string;
  quantity: number;
  rating_number: number;
  rating_point: number;
  brand_name: string;
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
  status: 'ACTIVE' | 'INACTIVE';
  sale_price: number;
  starting_timestamp: Date;
  ending_timestamp?: Date;
  ship_category_id: SHIP_CATEGORY_ID;
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
export interface ProductWithOtherFields {
  id: number;
  name: string;
  quantity: number;
  rating_number: number | null;
  rating_point: number | null;
  brand_id: number;
  origin?: string | null;
  producer?: string | null;
  manufactured_at?: string | null;
  target?: string | null;
  volume?: number | null;
  weight?: number | null;
  sold: number;
  caution?: string | null;
  instruction?: string | null;
  preservation?: string | null;
  description?: string | null;
  status: string;
  // category: {
  //   parent_category_id: number | null;
  // };
  ProductPricing: {
    price: number;
  }[];
}
