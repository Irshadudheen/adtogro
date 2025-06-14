import { Router } from "express";
import { Advertise } from "../../models/advertise";

const router =Router();
router.get('/api/advertise',async(req,res)=>{
   
    const advertise = await Advertise.find({isExpired:false,block:false,expiresAt:{ $gt: new Date() } }).sort({clicks:-1,impressions:-1, createdAt: -1});
    
 
    res.status(200).json({message:'Get Advertise success',advertise})
})
export { router as getAdvertiseRouter }