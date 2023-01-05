import { TonClient4 } from 'ton';

export const createTonLib = (): TonClient4 => {
  return new TonClient4({
    endpoint: 'https://mainnet-v4.tonhubapi.com',
  });
};
