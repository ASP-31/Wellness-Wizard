import pino from 'pino';

// Use pino-pretty for local dev, raw JSON for production
const targets = process.env.NODE_ENV !== 'production'
  ? { target: 'pino-pretty', options: { colorize: true } }
  : undefined;

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: targets
});

export default logger;
