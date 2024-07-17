import { Router } from 'express';
import { accessTokenValidator, roleValidator } from '../user/middlewares';
import { wrapAsync } from '~/utils/handler';
import { addVoucherValidator, editVoucherValidator } from './middlewares';
import {
  addVoucherController,
  getAllVoucherController,
  updateVoucherController,
} from './controllers';
import { paginationValidator } from '../chat_room/middlewares';

const voucherRouter = Router();

voucherRouter.post('/', roleValidator, addVoucherValidator, wrapAsync(addVoucherController));

voucherRouter.get(
  '/all',
  accessTokenValidator,
  paginationValidator,
  wrapAsync(getAllVoucherController),
);

voucherRouter.patch('/', roleValidator, editVoucherValidator, wrapAsync(updateVoucherController));

export default voucherRouter;
