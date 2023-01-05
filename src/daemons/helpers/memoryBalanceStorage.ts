import { Address } from 'ton';
import BN from 'bn.js';

import { WalletInfo } from '../../types/WalletInfo';

const balances: Record<string, BN> = {};

const addOrSubtractBalanceByWallet = (operation: 'add' | 'subtract', address: Address, coins: BN) => {
  const walletAddress = address.toString();
  if (!balances[walletAddress]) {
    balances[walletAddress] = new BN(0);
  }

  const currentBalance = balances[walletAddress];
  if (operation === 'add') {
    balances[walletAddress] = currentBalance.add(coins);
  }

  if (operation === 'subtract') {
    balances[walletAddress] = currentBalance.sub(coins);
  }
};

export const addBalanceByWallet = (address: Address, coins: BN): void => {
  addOrSubtractBalanceByWallet('add', address, coins);
};

export const subtractBalanceByWallet = (address: Address, coins: BN): void => {
  addOrSubtractBalanceByWallet('subtract', address, coins);
};

export const getWalletBalancesAddresses = (): Address[] => {
  return Object.keys(balances).map((addressString) => Address.parse(addressString));
};

export const getWalletsBalances = (): WalletInfo[] => {
  return Object.entries(balances).map(([addressString, balance]) => ({
    address: Address.parse(addressString),
    transactionsBalance: balance,
  }));
};
