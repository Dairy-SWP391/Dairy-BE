import { Request, Response } from 'express';
import { AddVoucherReqBody, UpdateVoucherReqBody } from './requests';
import { VOUCHER_MESSAGES } from './messages';
import voucherService from './service';
import { TokenPayload } from '../user/requests';
import userService from '../user/service';

export const addVoucherController = async (
  req: Request<any, any, AddVoucherReqBody>,
  res: Response,
) => {
  const { expired_at, quantity, trading_point, value, status, code } = req.body;
  const result = await voucherService.addVoucher({
    expired_at,
    quantity,
    trading_point,
    value,
    status,
    code,
  });

  res.status(200).json({
    message: VOUCHER_MESSAGES.ADD_VOUCHER_SUCCESSFULLY,
    data: result,
  });
};

export const getAllVoucherController = async (req: Request, res: Response) => {
  const { limit, page, status } = req.query;
  const { user_id } = req.decoded_authorization as TokenPayload;
  const user = (await userService.getUserById(user_id)) as any;
  const result = await voucherService.getAllVoucher({
    role: user.role,
    limit: limit as string,
    page: page as string,
    status: status as 'ACTIVE' | 'INACTIVE',
  });
  res.status(200).json({
    data: result,
    message: VOUCHER_MESSAGES.GET_ALL_VOUCHER_SUCCESSFULLY,
  });
};

export const updateVoucherController = async (
  req: Request<any, any, UpdateVoucherReqBody>,
  res: Response,
) => {
  const { expired_at, id, quantity, status, trading_point, value } = req.body;
  const result = await voucherService.updateVoucher({
    expired_at,
    id,
    quantity,
    status,
    trading_point,
    value,
  });
  res.json({
    message: VOUCHER_MESSAGES.UPDATE_VOUCHER_SUCCESSFULLY,
    data: result,
  });
};
