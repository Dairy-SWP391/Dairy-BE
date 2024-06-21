import { Request, Response } from 'express';
import shipServices from './service';
import { ParamsDictionary } from 'express-serve-static-core';
import {
  GetDistrictsReqBody,
  GetFeeReqBody,
  GetWardsReqBody,
  PackageCreateOrderReqBody,
  PackageServiceReqBody,
} from './requests';
import { CreateOrderParams, DistrictType, PackageServiceType, WardType } from './schema';
import orderService from '../order/service';
import { omit } from 'lodash';
import { CartListType } from '../order/schema';
// import { GetFeeReqBody } from '~/models/requests/Ship.requests'

export const getProvidersController = async (req: Request, res: Response) => {
  const providers = await shipServices.getProvinces();
  return res.json(providers);
};

export const getDistrictsController = async (
  req: Request<ParamsDictionary, DistrictType[], GetDistrictsReqBody>,
  res: Response,
) => {
  const provinceId = req.body.province_id;
  const districts = await shipServices.getDistricts(provinceId);
  return res.json(districts);
};

export const getWardsController = async (
  req: Request<ParamsDictionary, WardType[], GetWardsReqBody>,
  res: Response,
) => {
  const districtId = req.body.district_id;
  const wards = await shipServices.getWards(districtId);
  return res.json(wards);
};

export const getPackageServicesController = async (
  req: Request<ParamsDictionary, PackageServiceType[], PackageServiceReqBody>,
  res: Response,
) => {
  const { to_district } = req.body;
  const packageServices = await shipServices.getPackageServices(to_district);
  return res.json(packageServices);
};

export const getFeeController = async (
  req: Request<ParamsDictionary, any, GetFeeReqBody>,
  res: Response,
) => {
  const feeReq = omit(req.body, ['cart_list']);
  // tính tiền hàng trong cart
  // danh sách sản phẩm trong cart
  // hiển thị tiền của hàng hóa
  // hiển thị kích thước packege gói hàng
  const cart_list = req.body.cart_list;
  const cartList = await orderService.convertCartList(cart_list);
  const fee = await shipServices.getFee(feeReq, cartList);
  return res.json({ ...cartList, fee });
};

export const createOrderController = async (
  req: Request<ParamsDictionary, any, PackageCreateOrderReqBody>,
  res: Response,
) => {
  const userId = req.decoded_authorization.user_id as string;
  const cartList = await orderService.convertCartList(req.body.cart_list);
  const { service_id, to_district_id, to_ward_code, to_address, to_phone, content } = req.body;
  const getFreePackage = {
    service_id,
    to_district_id,
    to_ward_code,
  } as Omit<GetFeeReqBody, 'cart_list'>;
  const fee = await shipServices.getFee(getFreePackage, cartList);
  const createOrderParam = {
    userId: userId,
    fee,
    cartList: cartList as CartListType,
    ...getFreePackage,
    to_address,
    to_phone,
    content,
  } as CreateOrderParams;

  const order = await shipServices.createOrder(createOrderParam);
  return res.json(order);
};
