export const isLogsEnabled = () => {
  return process.env.ENALED_LOGS === 'true';
};

export const log = (message: string) => {
  if (!isLogsEnabled()) {
    return;
  }

  console.log(`[${new Date().toISOString()}]: ${message}`);
};

