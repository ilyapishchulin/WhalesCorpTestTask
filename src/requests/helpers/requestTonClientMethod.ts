import { Address, TonClient4, StackItem } from 'ton';
import { Methods } from '../enums/Methods';

const ALLOWED_RESPONSE_CODES = [0, 1];

export const requestTonClientMethod = (
  tonClient: TonClient4,
  seqno: number,
  address: Address,
  method: Methods,
  args?: StackItem[],
): Promise<StackItem[]> => {
  return new Promise((resolve, reject) => {
    tonClient.runMethod(seqno, address, method, args).then((responseData) => {
      if (!ALLOWED_RESPONSE_CODES.includes(responseData.exitCode)) {
        reject(`Invalid resolve member info response code, expected ${ALLOWED_RESPONSE_CODES}, get ${responseData.exitCode}`);
      }

      resolve(responseData.result);
    }).catch(reject);
  });
};
