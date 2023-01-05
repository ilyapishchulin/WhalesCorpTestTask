import { parseTransaction } from 'ton';
import BN from 'bn.js';

import { Cursor } from '../types/Cursor';
import { WalletInfo } from '../types/WalletInfo';

import { log } from '../utils/logger';
import { createTonLib } from '../utils/tonLib';
import { getPoolAddress } from '../utils/pool';

import { saveWalletInfoMany } from '../database/quries/saveWalletInfo';
import { getLastCheckedCursor } from '../database/quries/getLastCheckedCursor';
import { saveLastCheckedCursor } from '../database/quries/saveLastCheckedCursor';
import { getWalletInfoMany } from '../database/quries/getWalletInfo';

import { getStartParams } from './helpers/getStartParams';
import { isRequestedWithdraw, isUnSuccessfulTransaction, parseComment } from './helpers/transaction';
import { addBalanceByWallet, getWalletBalancesAddresses, getWalletsBalances, subtractBalanceByWallet } from './helpers/memoryBalanceStorage';

const tonLib = createTonLib();
const poolAddress = getPoolAddress();

getStartParams(tonLib, poolAddress).then(async ({ account: { last }, poolParams: { depositFee, receiptPrice } }) => {
  if (!last) {
    return;
  }

  const lastBlockLt = new BN(last.lt, 10);
  const lastCheckedCursorFromDB = await getLastCheckedCursor();

  const isSameCursorWithValueFromDB = (lt: BN) => {
    if (!lastCheckedCursorFromDB) {
      return false;
    }

    return lastCheckedCursorFromDB.lt.toString() === lt.toString();
  }

  if (isSameCursorWithValueFromDB(lastBlockLt)) {
    log(`There is no transactions for check, last cursor: ${last.lt}`);
    return;
  }

  const initialCursor: Cursor = {
    lt: lastBlockLt,
    hash: Buffer.from(last.hash, 'base64'),
  }
  let cursor: Cursor = initialCursor;
  let forceStop = false;

  while (!cursor.lt.isZero() && !forceStop) {
    const transactions = await tonLib.getAccountTransactions(poolAddress, cursor.lt, cursor.hash);
    transactions.forEach((transaction, index) => {
      const { inMessage, outMessages, description, prevTransaction, lt, update } = parseTransaction(transaction.block.workchain, transaction.tx.beginParse());
      if (isSameCursorWithValueFromDB(lt)) {
        saveLastCheckedCursor({
          lt,
          hash: update.newHash,
        });
        forceStop = true;
        return;
      }

      const isLastTransaction = index === transactions.length - 1;
      if (isLastTransaction) {
        cursor = prevTransaction;
      }

      if (!inMessage || isUnSuccessfulTransaction(description)) {
        return;
      }

      if (inMessage.info.type !== 'internal') {
        return;
      }

      if (isRequestedWithdraw(inMessage.info, outMessages)) {
        const [{ info }] = outMessages;
        if (info.type !== 'internal') {
          return;
        }

        subtractBalanceByWallet(info.dest, info.value.coins);
        return;
      }

      const comment = parseComment(inMessage.body);
      switch (comment) {
        case 'Deposit':
          addBalanceByWallet(inMessage.info.src, inMessage.info.value.coins.sub(depositFee).sub(receiptPrice));
          break;

        case 'Withdraw':
          if (!isRequestedWithdraw(inMessage.info, outMessages)) {
            return;
          }

          const [{ info }] = outMessages;
          if (info.type !== 'internal') {
            return;
          }

          subtractBalanceByWallet(inMessage.info.src, info.value.coins);
          break;
      }
    });

    log(`Processed ${transactions.length} transactions, next cursor ${cursor.lt}`);
  }

  if (!lastCheckedCursorFromDB) {
    await saveLastCheckedCursor(initialCursor);
  }

  const existedWallets = await getWalletInfoMany(getWalletBalancesAddresses());
  const walletsBalances = getWalletsBalances().map<WalletInfo>((walletInfo) => {
    const existedWalletBalance = existedWallets[walletInfo.address.toString()];
    if (existedWalletBalance) {
      return {
        address: walletInfo.address,
        transactionsBalance: walletInfo.transactionsBalance.add(existedWalletBalance),
      };
    }

    return walletInfo;
  });

  saveWalletInfoMany(walletsBalances).then(() => {
    log(`Succeed saved ${walletsBalances.length} wallets`);
  }).catch(() => {
    log(`Failed saved ${walletsBalances.length} wallets`);
  });
});
