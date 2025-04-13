import { Router } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { Advertise } from "../../models/advertise";

const router = Router();
router.put('/api/advertise/:id',async(req,res)=>{
    const {id}=req.params;
    const {companyName,companyWebsite,contactName,contactEmail,contactPhone,adDescription,adImage,targetAudience,advertisPlan}=req.body;
    const advertise=await Advertise.findById(id);
    if(!advertise){
        throw new BadRequestError('Advertise not found')
    }
    advertise.companyName=companyName;
    advertise.companyWebsite=companyWebsite;
    advertise.contactName=contactName;
    advertise.contactEmail=contactEmail;
    advertise.contactPhone=contactPhone;
    advertise.adDescription=adDescription;
    advertise.adImage=adImage;
    advertise.targetAudience=targetAudience;
    advertise.advertisPlan=advertisPlan;
    await advertise.save()
    res.status(200).json({message:'Update Advertise success',advertise})
})
 export { router as updateAdvertiseRouter }