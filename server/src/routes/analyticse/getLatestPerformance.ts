import { request, Router } from "express";
import { currentUser } from "../../middlewares/current-user";
import { Analytics } from "../../models/analytics";
import { Advertise } from "../../models/advertise";
import { BadRequestError } from "../../errors/bad-request-error";
import { getDay } from "date-fns";

const router = Router();
router.get('/api/analytics/latest-performance',currentUser, async (req , res)=>{
    const userId = req.currentUser?.id 
    const advertiseId = req.query.advertiseId as string;
    if(advertiseId){
      console.log(advertiseId,'id of advertise')
      const latestPerformance = await Advertise.findById(advertiseId)
      console.log(latestPerformance,'data from ad id')
      if(!latestPerformance){
         throw new BadRequestError('No performance data found for this user')
      }
      const  ctr = Math.round((latestPerformance.clicks / latestPerformance.impressions) * 100);
    const createAt =new Date(latestPerformance.createdAt) ;
    const now = new Date();
const diffTime = Math.abs(now.getTime() - createAt.getTime());
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const expiresAt = getDaysUntilExpire(latestPerformance.expiresAt);
      res.json({latestPerformance,ctr,lastDays:diffDays,expireDays:expiresAt,lastHours:diffHours})
    }else{
const latestPerformance = await Advertise.findOne({userId}).sort({clicks:-1})
      if(!latestPerformance){
         throw new BadRequestError('No performance data found for this user')
      }
    const  ctr = Math.round((latestPerformance.clicks / latestPerformance.impressions) * 100);
    const createAt =new Date(latestPerformance.createdAt) ;
    const now = new Date();
const diffTime = Math.abs(now.getTime() - createAt.getTime());
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const expiresAt = getDaysUntilExpire(latestPerformance.expiresAt);
      res.json({latestPerformance,ctr,lastDays:diffDays,expireDays:expiresAt,lastHours:diffHours})
    }
    
   
})
function getDaysUntilExpire(expiresAt: Date): number {
  const expiresDate = new Date(expiresAt);
  const now = new Date();

  const diffTime = expiresDate.getTime() - now.getTime(); // milliseconds
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert to days

  return diffDays;
}
export {router as getLatestPerformanceRouter}