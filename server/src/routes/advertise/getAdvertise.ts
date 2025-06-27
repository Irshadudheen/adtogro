import { Router } from "express";
import { Advertise } from "../../models/advertise";
import { advertiseLogger } from "../../loggers/advertiseLogger";

const router =Router();
router.get('/api/advertise',async(req,res)=>{
       advertiseLogger.info('GET /api/advertise')
   console.log('hi')
    const advertise = await Advertise.find({isExpired:false,block:false,expiresAt:{ $gt: new Date() } }).sort({clicks:-1,impressions:-1, createdAt: -1});
    
 
    res.status(200).json({message:'Get Advertise success',advertise})
})
export { router as getAdvertiseRouter }