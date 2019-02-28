import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
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
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }));
}
