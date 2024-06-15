import { DatabaseInstance } from '~/database/database.services';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Request, Response } from 'express';
import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { ErrorWithStatus } from '../error/entityError';
import { firebaseConfig } from './controllers';
import { IMAGE_MESSAGES } from './messages';
import HTTP_STATUS from '~/constants/httpsStatus';

class ImageService {
  async getProductImages(productId: number) {
    return await DatabaseInstance.getPrismaInstance().image.findMany({
      where: {
        parent_id: productId,
      },
    });
  }

  async uploadImage(req: Request) {
    const firebaseApp = initializeApp(firebaseConfig);
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new ErrorWithStatus({
        message: IMAGE_MESSAGES.NO_IMAGE_DATA,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      });
    }

    const storage = getStorage(firebaseApp);
    const uploadedFiles = [];

    for (const file of req.files) {
      const filePath = file.path;
      const fileBuffer = fs.readFileSync(filePath);
      const originalName = file.originalname;

      const metadata = {
        name: originalName,
        bucket: process.env.FIREBASE_STORAGE_BUCKET,
        contentType: 'image/jpeg',
        timeCreated: Date.now(),
      };

      const storageRef = ref(storage, originalName);
      await uploadBytes(storageRef, fileBuffer, metadata);
      const downloadURL = await getDownloadURL(storageRef);

      uploadedFiles.push(downloadURL);

      fs.unlinkSync(filePath);
    }
    return uploadedFiles;
  }
}

const imageService = new ImageService();

export default imageService;
