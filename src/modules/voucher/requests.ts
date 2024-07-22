export interface AddVoucherReqBody {
  code?: string;
  value: number;
  trading_point: number;
  expired_at: string;
  quantity: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateVoucherReqBody {
  id: number;
  value: number;
  trading_point: number;
  expired_at: string;
  quantity: number;
  status: 'ACTIVE' | 'INACTIVE';
}
