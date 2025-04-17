import cron from 'node-cron';
import { Advertise } from '../models/advertise';


import sendMail from '../service/mail';

// Runs once every day at 9 AM
export const startAdExpiryReminder = () => {
cron.schedule('0 9 * * *', async () => {
  try {
    const now = new Date();
    const targetDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days ahead

    const expiringAds = await Advertise.find({ 
      isExpired: false,
      expiresAt: {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lte: new Date(targetDate.setHours(23, 59, 59, 999))
      }
    }).populate('userId');

    for (const ad of expiringAds) {
      const user: any = ad.userId;
      await sendMail({
        to:  user.email,
        type: 'AD_EXPIRING_SOON',
        data: {
          name: user.name || ad.contactName,
          adTitle: ad.companyName,
          expiresAt: ad.expiresAt,
          renewLink: `${process.env.CLIENT_URL}/ads/renew/${ad.id}`
        }
      });
    }
    console.log(`Sent ad expiry warnings to ${expiringAds.length} users`);
    const expired = await Advertise.updateMany(
        {
          isExpired: false,
          expiresAt: { $lt: now }
        },
        {
          $set: { isExpired: true }
        }
      );

      console.log(`✅ Updated ${expired.modifiedCount} expired ads`);

   
  } catch (err) {
    console.error('Error sending expiry notifications:', err);
  }
})};
