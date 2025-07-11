import winston from 'winston';

export const advertiseLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'logs/order.log',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});