import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import { getAllBrandsController } from './controllers';

const brandRouter = Router();

brandRouter.get('/all', wrapAsync(getAllBrandsController));

export default brandRouter;
