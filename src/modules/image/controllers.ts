import { Request, Response } from 'express';
import imageService from './service';
import { IMAGE_MESSAGES } from './messages';
export const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: 'dairy-7d363.appspot.com',
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

export const uploadImageController = async (req: Request, res: Response) => {
  const result = await imageService.uploadImage(req);
  res.json({
    message: IMAGE_MESSAGES.UPLOAD_IMAGE_SUCCESS,
    data: result,
  });
};
