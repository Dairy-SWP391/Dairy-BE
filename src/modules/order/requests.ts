export interface CartListItem {
  product_id: string;
  quantity: string;
}

export interface CancelOrderRequestBody {
  order_id: number;
  cancel_reason: string;
}
