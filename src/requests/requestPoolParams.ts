import { Address, TonClient4, TupleSlice4 } from 'ton';
import BN from 'bn.js';

import { Methods } from './enums/Methods';
import { requestTonClientMethod } from './helpers/requestTonClientMethod';

type PoolParamsResponse = {
  enabled: boolean;
  udpatesEnabled: boolean;
  minStake: BN;
  depositFee: BN;
  withdrawFee: BN;
  poolFee: BN;
  receiptPrice: BN;
}

export const requestPoolParams = (
  tonClient: TonClient4,
  seqno: number,
  address: Address,
): Promise<PoolParamsResponse> => {
  return requestTonClientMethod(tonClient, seqno, address, Methods.GET_PARAMS).then((result) => {
    const information = new TupleSlice4(result);
    return {
      enabled: information.readBoolean(),
      udpatesEnabled: information.readBoolean(),
      minStake: information.readBigNumber(),
      depositFee: information.readBigNumber(),
      withdrawFee: information.readBigNumber(),
      poolFee: information.readBigNumber(),
      receiptPrice: information.readBigNumber()
    };
  });
};
