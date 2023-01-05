import { Address } from 'ton';
import { ServerHandler } from './ServerHandler';

import { createTonLib } from '../../utils/tonLib';
import { getPoolAddress } from '../../utils/pool';

import { getWalletInfo } from '../../database/quries/getWalletInfo';
import { requestPoolMemberInfo } from '../../requests/requestPoolMemberInfo';

interface WalletInfoParams {
  address: string;
}

interface WalletInfoResponse {
  balance: string;
  totalEarnings: string;
}

export class WalletInfoRequest extends ServerHandler<WalletInfoParams, WalletInfoResponse> {
  public isValidParams(params: WalletInfoParams): boolean {
    try {
      Address.parse(params.address);
      return true;
    } catch (e) {
      return false;
    }
  }

  public async handle() {
    const { address } = super.getParams();

    const parsedAddress = Address.parse(address);
    const tonLib = createTonLib();
    const block = await tonLib.getLastBlock();

    const [poolMemberInfo, walletInfo] = await Promise.all([
      requestPoolMemberInfo(tonLib, block.last.seqno, parsedAddress, getPoolAddress()),
      getWalletInfo(parsedAddress),
    ]);

    if (!walletInfo) {
      return {
        balance: '0',
        totalEarnings: '0',
      };
    }

    return {
      balance: poolMemberInfo.balance.add(poolMemberInfo.pendingDeposit).toString(),
      totalEarnings: walletInfo.transactionsBalance.sub(poolMemberInfo.balance).sub(poolMemberInfo.pendingDeposit).neg().toString(),
    };
  }
}
