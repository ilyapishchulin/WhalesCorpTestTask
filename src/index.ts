import { syncParseTransactions } from './daemons/syncParseTransactions';
import { initAPIRouter } from './api/router';

syncParseTransactions();
initAPIRouter();
