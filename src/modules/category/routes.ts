import { Router } from 'express';
import { wrapAsync } from '~/utils/handler';
import { GetAllCategoriesController } from './controllers';

const categoryRouter = Router();

/*
GetAllCategory
*/
categoryRouter.get('/all', wrapAsync(GetAllCategoriesController));

export default categoryRouter;
