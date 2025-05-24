import { Analytics } from "../models/analytics";
import geoip, { Lookup } from "geoip-lite"; // includes Lookup type
import { getDeviceType } from "../validators/user-agent";
import { NextFunction, Request, Response } from "express";

type EventType = 'click' | 'impression';



export const trackEvent = (eventType: EventType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const start: number = Date.now();

    res.on("finish", async (): Promise<void> => {
      try {
        const geo: Lookup | null = geoip.lookup(req.ip!);
        const deviceType = getDeviceType(req.headers["user-agent"] || "");
       console.log(req.headers["user-agent"],'user-agent')
        await Analytics.findOneAndUpdate(
            
  { adId: req.params.id
   },
  {
    $push: {
      events: {
        eventType,
        deviceType: getDeviceType(req.headers["user-agent"] || ""),
        country: geo?.country || "Unknown",
        createdAt: new Date(),
      },
    },
  }
);
      } catch (err) {
        console.error("Analytics tracking error:", err);
      }
    });

    next();
  };
};
