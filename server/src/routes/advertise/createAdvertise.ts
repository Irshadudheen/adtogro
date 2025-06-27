import {Request, Response, Router} from 'express'

import { createAdValidate } from '../../validators/createAdValidate'
import { validateRequest } from '../../middlewares/validateRequest'
import { Advertise } from '../../models/advertise'
import { BadRequestError } from '../../errors/bad-request-error'
import { instance } from '../../payment_gateway/razorpay'
import { Order } from '../../models/order'
import sendMail from '../../service/mail'
import { User } from '../../models/user'
import { currentUser } from '../../middlewares/current-user'
import { body } from 'express-validator'
import { Analytics } from '../../models/analytics'
import { advertiseLogger } from '../../loggers/advertiseLogger'
const router =Router()
router.post('/api/advertise',
   
    currentUser,
    [body('order_id').notEmpty().withMessage('Order id is required')],
    validateRequest,
    async (req:Request,res:Response)=>{
        advertiseLogger.info('GET /api/advertise')
        const userId = req.currentUser?.id as string
       
        const existingAdvertiseCount = await Advertise.countDocuments(); 
        if(existingAdvertiseCount >100) {
           throw new BadRequestError('Advertise limit reached')
        }
        const order = await Order.findById(req.body.order_id)
        // const order = Order.build({userId,orderData:req.body,totalPrice:4000,createAt:new Date,status:'pending'})
        if(!order){
            throw new BadRequestError('Order not found')
        }
    order.status = 'completed'
        await order.save();
         const user = await User.findById(userId)
         if(!user){
             throw new BadRequestError('User not found')
         }
         sendMail({to:user.email,type:"PAYMENT_SUCCESS",data:{name:user.name,amount:order.totalPrice,plan:order.orderData.advertisPlan}})
        const advertise = Advertise.build({
            userId,
            companyName:order.orderData.companyName,
            companyWebsite:order.orderData.companyWebsite,
            contactName:order.orderData.contactName,
            contactEmail:order.orderData.contactEmail,
            contactPhone:order.orderData.contactPhone,
            adDescription:order.orderData.adDescription,
            adImage:order.orderData.adImage,
            orginalImage:order.orderData.orginalImage,
            targetAudience:order.orderData.targetAudience,
            advertisPlan:order.orderData.advertisPlan,

            clicks:0,
            createdAt:new Date,
            expiresAt: order.adExpireAt, 
            impressions:0
        })
       user.is_purchasedAd = true
       await user.save();
        await advertise.save()
        await Analytics.create({userId:req.currentUser?.id,adId:advertise.id,events:[]})
        sendMail({to:user.email,type:"AD_CREATED",data:{name:user.name,adTitile:order.orderData.companyName}})
        res.status(201).send(advertise)
    }
)
export { router as createAdvertiseRouter}