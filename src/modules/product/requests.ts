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
