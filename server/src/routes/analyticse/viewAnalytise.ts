import { Router } from "express";
import { Analytics } from "../../models/analytics";
import { BadRequestError } from "../../errors/bad-request-error";
import mongoose from "mongoose";
import { currentUser } from "../../middlewares/current-user";
type Event = {
  _id: 'click' | 'impression' | string;
  count: number;
};
interface DailyStat {
  name: string;         // ISO date string (e.g., '2025-05-24')
  clicks: number;
  impressions: number;
  ctr: number;          // click-through rate, percentage (0–100)
}

type ClickStatus = {
  today: Event[];
  todayCtr?: number;
};
const router = Router()
router.get('/api/analytics',currentUser,async(req,res)=>{
const userId = new mongoose.Types.ObjectId(req.currentUser?.id!);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29); // last 30 days

 const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const endOfToday = new Date();
endOfToday.setHours(23, 59, 59, 999);

const clickStatus = await Analytics.aggregate([
  { $match: { userId } }, // Global filter by user
  { $unwind: '$events' }, // Flatten events array
  {
    $facet: {
      daily: [
        {
          $group: {
            _id: {
              deviceType: '$events.deviceType',
              day: { $dayOfMonth: '$events.createdAt' },
              month: { $month: '$events.createdAt' },
              year: { $year: '$events.createdAt' },
            },
            count: { $sum: 1 },
          },
        },
      ],
      weekly: [
        {
          $group: {
            _id: {
              deviceType: '$events.deviceType',
              week: { $isoWeek: '$events.createdAt' },
              year: { $isoWeekYear: '$events.createdAt' },
            },
            count: { $sum: 1 },
          },
        },
      ],
      monthly: [
        {
          $group: {
            _id: {
              deviceType: '$events.deviceType',
              month: { $month: '$events.createdAt' },
              year: { $year: '$events.createdAt' },
            },
            count: { $sum: 1 },
          },
        },
      ],
      lastSixMonths: [
        {
          $match: {
            'events.createdAt': {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            },
          },
        },
        {
          $group: {
            _id: {
              deviceType: '$events.deviceType',
              month: { $month: '$events.createdAt' },
              year: { $year: '$events.createdAt' },
            },
            count: { $sum: 1 },
          },
        },
      ],
      totalByDevice: [
        {
          $group: {
            _id: '$events.deviceType',
            value: { $sum: 1 },
          },
        },
      ],
      today: [
        {
          $match: {
            'events.createdAt': {
              $gte: startOfToday,
              $lte: endOfToday,
            },
            'events.eventType': { $in: ['click', 'impression'] },
          },
        },
        {
          $group: {
            _id: '$events.eventType',
            count: { $sum: 1 },
          },
        },
      ],
    },
  },
]);
const dailyRaw = await Analytics.aggregate([
    { $match: { userId } },
    { $unwind: '$events' },
    {
      $match: {
        'events.createdAt': { $gte: thirtyDaysAgo },
        'events.eventType': { $in: ['click', 'impression'] }
      }
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$events.createdAt" }
          },
          eventType: "$events.eventType"
        },
        count: { $sum: 1 }
      }
    }
  ]);

  // Organize by date
  const dateMap: Record<string, { clicks: number; impressions: number }> = {};

  for (const entry of dailyRaw) {
    const date = entry._id.date;
    if (!dateMap[date]) {
      dateMap[date] = { clicks: 0, impressions: 0 };
    }
    if (entry._id.eventType === 'click') {
      dateMap[date].clicks = entry.count;
    } else if (entry._id.eventType === 'impression') {
      dateMap[date].impressions = entry.count;
    }
  }

  const daily: DailyStat[] = Object.entries(dateMap).map(([date, { clicks, impressions }]) => ({
  name: date,
  clicks,
  impressions,
  ctr: impressions ? parseFloat(((clicks / impressions) * 100).toFixed(1)) : 0
}));

daily.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
if(daily.length){
daily[daily.length - 1].name = 'Today'; 
}

if(daily[daily.length -2]){
  daily[daily.length - 2].name = 'Yesterday'; 
}
  clickStatus[0].daily = daily;
clickStatus[0].todayCtr = Math.round(
  ((clickStatus[0].today.find((event: Event) => event._id === 'click')?.count ?? 0) /
    (clickStatus[0].today.find((event: Event) => event._id === 'impression')?.count ?? 0)) *
    100 )|| 0;
  res.send(clickStatus[0])
})
export {router as AnalyticsStatusRouter}