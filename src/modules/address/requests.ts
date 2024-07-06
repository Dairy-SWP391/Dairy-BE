export interface AddAddressReqBody {
  name: string;
  phone_number: string;
  address: string;
  default_address: boolean;
  user_id: string;
  district_id: string;
  province_id: string;
  ward_code: string;
}
export interface UpdateAddressReqBody {
  id: string;
  name: string;
  phone_number: string;
  address: string;
  default_address: boolean;
  district_id: string;
  province_id: string;
  ward_code: string;
}
