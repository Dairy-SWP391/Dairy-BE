import { Router } from 'express';
import { checkPaymentResultMiddleware, createPaymentController } from './controllers';
import { accessTokenValidator } from '../user/middlewares';
import { getFeeMiddleware } from '../ship/middlewares';
import { checkCartValidMiddleware } from '../order/middlewares';
import { wrapAsync } from '~/utils/handler';
const payRouter = Router();

/*
desc: create payment
path: /pay/
method: get
headers: {Authorization: Bearer accessToken}
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
vnpCreateInfoReqBody {
  amount: number; //số tiền
  order_description: string; //mô tả thông tin chuyển khoảng, không bỏ trống
}
*/
payRouter.get(
  '/',
  accessTokenValidator,
  getFeeMiddleware,
  wrapAsync(checkCartValidMiddleware),
  createPaymentController,
);
payRouter.get('/result', wrapAsync(checkPaymentResultMiddleware));

export default payRouter;
