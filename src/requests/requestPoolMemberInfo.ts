import { Address, beginCell, TonClient4, TupleSlice4 } from 'ton';
import BN from 'bn.js';

import { Methods } from './enums/Methods';
import { requestTonClientMethod } from './helpers/requestTonClientMethod';

type PoolMemberInfoResponse = {
  balance: BN;
  pendingDeposit: BN;
  pendingWithdraw: BN;
  withdraw: BN;
}

export const requestPoolMemberInfo = (tonClient: TonClient4, seqno: number, poolAddress: Address, address: Address): Promise<PoolMemberInfoResponse> => {
  return requestTonClientMethod(tonClient, seqno, address, Methods.GET_MEMBER, [{
    type: 'slice',
    cell: beginCell().storeAddress(poolAddress).endCell(),
  }]).then((result) => {
    const information = new TupleSlice4(result);
    return {
      balance: information.readBigNumber(),
      pendingDeposit: information.readBigNumber(),
      pendingWithdraw: information.readBigNumber(),
      withdraw: information.readBigNumber(),
    };
  });
};
