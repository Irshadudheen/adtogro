import Analytics from "../models/Analytics";
import useragent from "express-useragent";
import geoip from "geoip-lite";
import { Url } from "../models/url";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";

export const trackAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shortUrl } = req.params;
    const urlRecord = await Url.findOne({ shortUrl });

    const userAgent = useragent.parse(req.headers["user-agent"] as string);
    const ip = req.ip || req.connection.remoteAddress;
    const geo = geoip.lookup(ip as string);

    if (!urlRecord) {
      throw new BadRequestError('Short Url is Not Found')
      // return res.status(404).json({ error: 'Short Url Is Not Found' });
    }

    const analytics = new Analytics({
      urlId: urlRecord._id,
      userAgent: req.headers["user-agent"],
      ipAddress: ip,
      country: geo?.country,
      city: geo?.city,
      osType: userAgent.os,
      deviceType: userAgent.isMobile ? "mobile" : "desktop",
      browser: userAgent.browser,
      referrer: req.headers.referer || "",
      uniqueVisitorId: req.headers["x-forwarded-for"] || ip
    });

    await analytics.save();
    next(); // Pass control to the next middleware
  } catch (error: any) {
    console.error("Analytics Error:", error);
    next(error); // Pass the error to the error-handling middleware
  }
};

