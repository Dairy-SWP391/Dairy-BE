export interface AddAddressReqBody {
  name: string;
  phone_number: string;
  address: string;
  default_address: boolean;
  user_id: string;
}
export interface UpdateAddressReqBody {
  id: number;
  name: string;
  phone_number: string;
  address: string;
  default_address: boolean;
}
