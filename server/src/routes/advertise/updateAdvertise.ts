import { Request, Response, Router } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { Advertise } from "../../models/advertise";
import { currentUser } from "../../middlewares/current-user";


const router = Router();
router.put('/api/advertise/:id',
    currentUser,
    
    async(req:Request,res:Response)=>{
    const {id}=req.params;
    const {companyName,companyWebsite,contactName,contactEmail,contactPhone,adDescription,adImage,targetAudience,advertisPlan,orginalImage}=req.body;
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
    advertise.orginalImage=orginalImage;
    await advertise.save()
    res.status(200).json({message:'Update Advertise success',advertise})
})
 export { router as updateAdvertiseRouter }