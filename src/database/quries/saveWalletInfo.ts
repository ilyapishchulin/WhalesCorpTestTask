import { Address } from 'ton';
import BN from 'bn.js';

import { prisma } from '../client';
import { WalletInfo } from '../../types/WalletInfo';

export const saveWalletInfoMany = (wallets: WalletInfo[]) => {
  // Prisma doesn't support upsertMany, waiting in https://github.com/prisma/prisma/issues/4134
  return Promise.all(wallets.map((wallet) => saveWalletInfo(wallet.address, wallet.transactionsBalance)));
}

export const saveWalletInfo = (address: Address, transactionsBalance: BN): Promise<boolean> => {
  const createOrUpdateObject = {
    address: address.toString(),
    transactionsBalance: transactionsBalance.toString(),
  };

  return new Promise((resolve, reject) => {
    prisma.$transaction([
      prisma.wallets.upsert({
        where: {
          address: address.toString(),
        },
        create: createOrUpdateObject,
        update: createOrUpdateObject,
      }),
    ]).then(([response]) => {
      if (!response) {
        resolve(false);
        return;
      }

      resolve(true);
    }).catch(reject);
  });
};
