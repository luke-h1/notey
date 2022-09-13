import pino from 'pino';

const logger = pino({
  name: '@notey/api',
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});
export default logger;
