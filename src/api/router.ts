import fastify from 'fastify';

import { isLogsEnabled } from '../utils/logger';
import { WalletInfoRequest } from './handlers/WalletInfoRequest';

export const initAPIRouter = () => {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  const server = fastify({
    logger: isLogsEnabled(),
  });

  server.get('/:address', (...args) => new WalletInfoRequest(...args).initHandler());

  server.listen({
    port
  }, (err) => {
    if (err) {
      server.log.error(err)
      process.exit(1)
    }
  });
}
