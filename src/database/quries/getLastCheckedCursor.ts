import BN from 'bn.js';

import { prisma } from '../client';
import { Cursor } from '../../types/Cursor';

export const getLastCheckedCursor = (): Promise<Cursor | null> => {
  return new Promise((resolve, reject) => {
    prisma.lastCheckedCursors.findFirst().then((lastTransaction) => {
      if (!lastTransaction) {
        resolve(null);
        return;
      }

      resolve({
        lt: new BN(lastTransaction.lt),
        hash: Buffer.from(lastTransaction.hash),
      })
      resolve(null);
    }).catch(reject);
  });
}
