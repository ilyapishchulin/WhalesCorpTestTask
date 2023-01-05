import { Address } from 'ton';
import BN from 'bn.js';

export type WalletInfo = {
  address: Address;
  transactionsBalance: BN;
};
