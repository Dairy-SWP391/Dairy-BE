import { CartListItem } from '../order/requests';

export interface GetDistrictsReqBody {
  province_id: string;
}

export interface GetWardsReqBody {
  district_id: string;
}

export interface PackageServiceReqBody {
  to_district: string;
}

export interface GetFeeReqBody {
  service_id: string;
  to_district_id: string;
  to_ward_code: string;
  cart_list: CartListItem[];
  receiver_name: string;
  phone_number: string;
  address: string;
}
export interface PackageCreateOrderReqBody extends GetFeeReqBody {
  to_phone: string;
  to_address: string;
  content: string;
}
