// import { RateLimiterRedis } from 'rate-limiter-flexible';
// import { redisClient } from '../config/redis'; 
import { NextFunction, Request, Response } from 'express';
import { RateLimitError } from '../errors/Rate-limit-error';

const createRateLimiter = (duration:number, points:number) => {
  // const rateLimiter = new RateLimiterRedis({
  //   storeClient: redisClient,
  //   keyPrefix: 'rate-limit',
  //   points, 
  //   duration: duration / 1000, 
  // });

  return async (req:Request, res:Response, next:NextFunction) => {
    try {
     
      const key = req.ip;
      // await rateLimiter.consume(key as string);
      next();
    } catch (error) {
        // throw new BadRequestError('Too many requests, Please try again later')
      throw new RateLimitError() 
    }
  };
};

export const createURLLimiter = createRateLimiter(10 * 1000, 5);  
export const createAnalyticsLimiter = createRateLimiter(5 * 1000, 3); 