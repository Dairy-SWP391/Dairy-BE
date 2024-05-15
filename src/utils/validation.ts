import { Response, Request, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema';
import HTTP_STATUS from '~/constants/httpsStatus';
import { ErrorEntity, ErrorWithStatus } from '~/modules/error/entityError';

export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validations.run(req);

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const errorsObject = errors.mapped();
    const errorEntity = new ErrorEntity({ data: {} });

    Object.keys(errorsObject).forEach((key) => {
      const { msg } = errorsObject[key];

      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg);
      }

      errorEntity.data[key] = msg;
    });

    // Throw for defaultErrorHandler
    next(errorEntity);
  };
};
