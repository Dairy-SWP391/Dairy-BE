import { Router } from 'express';
import { uploadImageController } from './controllers';
import { wrapAsync } from '~/utils/handler';
import multer from 'multer';
const imageRouter = Router();
const upload = multer({ dest: 'uploads/' });
imageRouter.post('/upload-image', upload.array('images', 4), wrapAsync(uploadImageController));
export default imageRouter;
