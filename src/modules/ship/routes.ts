import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import {
  createOrderController,
  getDistrictsController,
  getFeeController,
  getPackageServicesController,
  getProvidersController,
  getWardsController,
} from './controllers';
import {
  getDistrictsMiddleware,
  getFeeMiddleware,
  getPackageServicesMiddleware,
  getWardsMiddleware,
} from './middlewares';
import { checkCartValidMiddleware } from '../order/middlewares';
import { accessTokenValidator } from '../user/middlewares';
const shipRouter = Router();

/*
path: /provinces
method: get
description: Get all provinces
{
    "ProvinceID": number,
    "ProvinceName": string
}
*/
shipRouter.get('/provinces', wrapAsync(getProvidersController));

/*
path: /districts
method: get
body: province_id
description: Get all districts of a province
422: Province id is required | Province id must be string
400: Province id is invalid (mã không tồn tại)
{
    "DistrictID": number,
    "DistrictName": string
}
*/
shipRouter.post('/districts', getDistrictsMiddleware, wrapAsync(getDistrictsController));

/*
path: /wards
method: get
body: district_id
description: Get all wards of a district
422: district id is required | district id must be string
400: district id is invalid (mã không tồn tại)
{
    "WardCode": number,
    "WardName": string
}
*/
shipRouter.post('/wards', getWardsMiddleware, wrapAsync(getWardsController));

/*
path: /package-services
method: post
body:{
    "to_district": string
}
description: lấy ra các hình thức vận chuyển của ghn dành cho tuyến đường từ from_district đến to_district
response:{
    "service_id": number,
    "short_name": string,
}
*/
shipRouter.post(
  '/package-services',
  getPackageServicesMiddleware,
  wrapAsync(getPackageServicesController),
);

/*
path: /fee
method: post
body{
    "service_id":53321,
    "from_district_id":3695,
    "to_district_id":3440,
    "to_ward_code":"13010",
    "cart_list": [
        {
            "product_id": "1",
            "quantity": "1"
        },
        ...
    ]
}
checkCartValidMiddleware: kiểm tra xem giỏ hàng có sản phẩm không, và có đúng format không
*/
shipRouter.post(
  '/fee',
  getFeeMiddleware,
  wrapAsync(checkCartValidMiddleware),
  wrapAsync(getFeeController),
);

/*
description: tạo đơn hàng
method: post
headers: {
    Authorization: Bearer token
}
body:{
    "to_phone": '0987654321',
    "to_address": "72 Thành Thái, Phường 14, Quận 10, Hồ Chí Minh, Vietnam",
    "to_ward_code": "21014",
    "to_district_id": "1452",
    "content": "giao cho mình buổi sáng nhé",
    "service_id": "53320",//chuyển thương mại điện tử
    "cart_list": [
            {
                "name":"Áo Polo",
                "code":"Polo123",
                "quantity": 1,
                "price": 200000,
                "length": 12,
                "width": 12,
                "height": 12,
                "weight": 1200,
                "category":{
                    "level1":"Áo"
                }
            }
        ]
}
*/
shipRouter.post(
  '/create-order',
  accessTokenValidator, // kiểm tra đã đăng nhập chưa
  getFeeMiddleware, // kiểm tra thông tin địa chỉ đặt hàng
  wrapAsync(checkCartValidMiddleware), // kiểm tra giỏ hàng
  wrapAsync(createOrderController),
);

export default shipRouter;
