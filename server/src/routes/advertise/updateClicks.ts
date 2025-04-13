import { Router } from "express";
import { Advertise } from "../../models/advertise";
import { BadRequestError } from "../../errors/bad-request-error";

const router = Router();
router.patch('/api/advertise/:id',async(req,res)=>{
    const {id}=req.params;
    const advertise=await Advertise.findById(id);
    if(!advertise){
        throw new BadRequestError('Advertise not found')
    }
    advertise.clicks=advertise.clicks+1;
    await advertise.save()
    res.status(200).json({message:'Update clicks success',advertise})
})  
export { router as updateClicksRouter }