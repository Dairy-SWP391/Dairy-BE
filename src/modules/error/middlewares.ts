import { Request, Response } from 'express';
import { omit } from 'lodash';
import HTTP_STATUS from '~/constants/httpsStatus';
import { ErrorWithStatus } from '~/modules/error/model';

export const defaultErrorHandler = (err: any, req: Request, res: Response) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']));
  }
  // nếu không lọt vào if ở trên thì tức là error này là lỗi mặc định
  // {name, message, stack} là các thuộc tính mặc định của Error | enumerable = false
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true });
  });
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message as string,
    errorInfor: omit(err, ['stack']),
  });
};
