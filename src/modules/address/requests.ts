export interface AddAddressReqBody {
  name: string;
  phone_number: string;
  address: string;
  default_address: boolean;
  user_id: string;
  district_id: number;
  province_id: number;
  ward_code: number;
}
export interface UpdateAddressReqBody {
  id: number;
  name: string;
  phone_number: string;
  address: string;
  default_address: boolean;
}
