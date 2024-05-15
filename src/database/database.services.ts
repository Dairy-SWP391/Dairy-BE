import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

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
