import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

export namespace DatabaseInstance {
  const prisma = new PrismaClient();

  export const getPrismaInstance = (): PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    DefaultArgs
  > => {
    return prisma;
  };
}

const firebaseConfig = {
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);

export const firebaseDb = getDatabase(app);
