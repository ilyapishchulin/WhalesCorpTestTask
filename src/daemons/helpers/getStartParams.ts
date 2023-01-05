import { Address, TonClient4 } from 'ton';
import { requestPoolParams } from '../../requests/requestPoolParams';

export const getStartParams = async (tonLib: TonClient4, poolAddress: Address) => {
  const block = await tonLib.getLastBlock();
  const { seqno } = block.last;

  const [accountInfo, poolParams] = await Promise.all([
    tonLib.getAccount(seqno, poolAddress),
    requestPoolParams(tonLib, seqno, poolAddress)
  ]);

  return {
    account: accountInfo.account,
    poolParams,
  };
};
