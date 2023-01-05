import { fork } from 'child_process';

const PAUSE_BETWEEN_SCRIPT_EXECUTIONS = 30 * 1000;

export const syncParseTransactions = () => {
  const process = fork('./src/daemons/asyncParseTransactions.ts');
  process.on('exit', () => setTimeout(syncParseTransactions, PAUSE_BETWEEN_SCRIPT_EXECUTIONS));
};
