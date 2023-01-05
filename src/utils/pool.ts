import { Address } from 'ton';

export const getPoolAddress = (): Address => {
  if (!process.env.POOL_ADDRESS) {
    throw new Error("Can't find env, specify env POOL_ADDRESS");
  }

  return Address.parse(process.env.POOL_ADDRESS);
};
