import { Router } from 'express';
import { roleValidator } from '../user/middlewares';
import { wrapAsync } from '~/utils/handler';
import { addVoucherValidator } from './middlewares';
import { addVoucherController } from './controllers';

const voucherRouter = Router();

voucherRouter.post('/voucher', roleValidator, addVoucherValidator, wrapAsync(addVoucherController));

export default voucherRouter;
