import { RawMessage, RawTransactionDescription, InternalCommonMessageInfo, Cell } from 'ton';

export const isUnSuccessfulTransaction = (description: RawTransactionDescription): boolean => {
  if (description.type !== 'generic') {
    return true;
  }

  const { computePhase } = description;
  return computePhase.type === 'computed' && !computePhase.success;
};

export const isRequestedWithdraw = (inMessageInfo: InternalCommonMessageInfo, outMessages: RawMessage[]): boolean => {
  if (outMessages.length !== 1) {
    return false;
  }

  const [firstOutMessage] = outMessages;
  if (firstOutMessage.info.type !== 'internal') {
    return false;
  }

  return firstOutMessage.info.value.coins.gt(inMessageInfo.value.coins);
}

export const parseComment = (cell: Cell): string | null => {
  let slice = cell.beginParse();
  if (slice.remaining < 32) {
    return null;
  }

  if (slice.readUintNumber(32) !== 0) {
    return null;
  }

  let res = slice.readBuffer(Math.floor(slice.remaining / 8)).toString();
  let rr = slice;

  if (rr.remainingRefs > 0) {
    rr = rr.readRef();
    res += rr.readBuffer(Math.floor(rr.remaining / 8)).toString();
  }

  return res;
}
