import BN from 'bn.js';

export type Cursor = {
  lt: BN,
  hash: Buffer,
};
