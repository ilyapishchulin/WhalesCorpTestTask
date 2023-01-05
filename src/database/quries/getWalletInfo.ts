import { Address } from 'ton';
import BN from 'bn.js';

import { prisma } from '../client';
import { WalletInfo } from '../../types/WalletInfo';

export const getWalletInfoMany = (addresses: Address[]): Promise<Record<string, BN>> => {
  const whereQueries = addresses.map((address) => ({
    address: {
      equals: address.toString(),
    },
  }));

  return new Promise((resolve, reject) => {
    prisma.wallets.findMany({
      where: {
        OR: whereQueries,
      },
    }).then((wallets) => {
      if (!wallets) {
        resolve({});
        return;
      }

      resolve(wallets.reduce<Record<string, BN>>((acc, { address, transactionsBalance }) => {
        acc[address] = new BN(transactionsBalance);
        return acc;
      }, {}));
    }).catch(reject);
  });
}

export const getWalletInfo = (address: Address): Promise<WalletInfo | null> => {
  return new Promise((resolve, reject) => {
    prisma.wallets.findUnique({
      where: {
        address: address.toString(),
      },
    }).then((wallet) => {
      if (!wallet) {
        resolve(null);
        return;
      }

      resolve({
        address: Address.parse(wallet.address),
        transactionsBalance: new BN(wallet.transactionsBalance),
      });
    }).catch(reject);
  });
};
