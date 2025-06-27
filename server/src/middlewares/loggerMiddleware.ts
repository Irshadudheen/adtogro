import { NextFunction, Request, Response } from "express";
import winston from "winston";
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'logs/app.log',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});
export function logRequest(req: Request, res: Response, next: NextFunction) {
    if (req.method == 'OPTIONS') {
    next()
    return
  }
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  });

  next();
}