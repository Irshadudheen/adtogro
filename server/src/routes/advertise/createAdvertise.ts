import {Request, Response, Router} from 'express'

import { createAdValidate } from '../../validators/createAdValidate'
import { validateRequest } from '../../middlewares/validateRequest'
import { Advertise } from '../../models/advertise'
const router =Router()
router.post('/api/advertise',createAdValidate,validateRequest,
    async (req:Request,res:Response)=>{
        const {userId,
        companyName,
        companyWebsite,
        contactName,contactEmail,
        contactPhone,adDescription,adImage,
        targetAudience,advertisPlan} = req.body
        const advertise = Advertise.build({
            userId,
            companyName,
            companyWebsite,
            contactName,
            contactEmail,
            contactPhone,
            adDescription,
            adImage,
            targetAudience,
            advertisPlan,
            clicks:0,
            createdAt:new Date
        })
        await advertise.save()
        res.status(201).send(advertise)
    }
)
export { router as createAdvertiseRouter}