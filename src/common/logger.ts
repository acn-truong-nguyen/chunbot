import winston from 'winston';
import expressWinston from 'express-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const winstonFileTransports = [
  new DailyRotateFile({
    filename: '%DATE%-error.log',
    datePattern: 'YYYYMMDD',
    level: 'error',
    dirname: process.env.LOG_LOCATION || path.join(__dirname, '..', '..', 'logs'),
  }),
  new DailyRotateFile({
    filename: '%DATE%-combined.log',
    datePattern: 'YYYYMMDD',
    dirname: process.env.LOG_LOCATION || path.join(__dirname, '..', '..', 'logs'),
  }),
];

const winstonConsoleTransports = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.simple(),
    winston.format.printf((info) => {
      const { timestamp, level, message, ...args } = info;
      return `${timestamp} ${level}: ${message} ${Object.keys(args).length ?
              JSON.stringify(args) : ''}`;
    }),
  ),
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: winstonFileTransports,
});

export const ewLogger = expressWinston.logger({
  transports: [...winstonFileTransports, winstonConsoleTransports],
  colorize: true,
  meta: false,
  expressFormat: true,
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(winstonConsoleTransports);
}
