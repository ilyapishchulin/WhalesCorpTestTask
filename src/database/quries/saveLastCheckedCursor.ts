import { prisma } from '../client';
import { Cursor } from '../../types/Cursor';

export const saveLastCheckedCursor = (cursor: Cursor): Promise<boolean> => {
  const createOrUpdateObject = {
    lt: cursor.lt.toString(),
    hash: cursor.hash.toString(),
  };

  return new Promise((resolve, reject) => {
    prisma.lastCheckedCursors.upsert({
      where: {
        lt: createOrUpdateObject.lt,
      },
      create: createOrUpdateObject,
      update: createOrUpdateObject,
    }).then((response) => {
      if (!response) {
        resolve(false);
        return;
      }

      resolve(true);
    }).catch(reject);
  });
};
