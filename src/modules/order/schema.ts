export interface CartListType {
  cart_list: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    ship_category_id: string;
    volume: number | null;
    weight: number;
  }[];
  allQuality: number;
  totalMoney: number;
}
