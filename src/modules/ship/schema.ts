import { CartListType } from '../order/schema';
import { GetFeeReqBody } from './requests';

export interface ProvinceType {
  ProvinceID: number;
  ProvinceName: string;
  CountryID: number;
  Code: string;
  NameExtension: string[];
  IsEnable: number;
  RegionID: number;
  RegionCPN: number;
  UpdatedBy: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  CanUpdateCOD: boolean;
  Status: number;
}

export interface DistrictType {
  DistrictID: number;
  DistrictName: string;
}

export interface WardType {
  WardCode: number;
  DistrictName: string;
}

export interface PackageServiceType {
  service_id: number;
  short_name: string;
}

export interface GetFeeType {
  total: number;
  service_fee: number;
  insurance_fee: number;
  pick_station_fee: number;
  coupon_value: number;
  r2s_fee: number;
  return_again: number;
  document_return: number;
  double_check: number;
  cod_fee: number;
  pick_remote_areas_fee: number;
  deliver_remote_areas_fee: number;
  cod_failed_fee: number;
  totalHeight: number;
  totalLength: number;
  totalWeight: number;
  totalWidth: number;
}

export interface CreateOrderParams extends Omit<GetFeeReqBody, 'cart_list'> {
  userId: string;
  cartList: CartListType;
  fee: GetFeeType;
  to_address: string;
  to_phone: string;
  content: string;
  receiver_name: string;
  address: string;
}
