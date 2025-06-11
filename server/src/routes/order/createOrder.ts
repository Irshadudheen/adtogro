import {Request, Response, Router} from 'express'

import { createAdValidate } from '../../validators/createAdValidate'
import { validateRequest } from '../../middlewares/validateRequest'
import { Advertise } from '../../models/advertise'
import { BadRequestError } from '../../errors/bad-request-error'
import { instance } from '../../payment_gateway/razorpay'
import { Order } from '../../models/order'
import { currentUser } from '../../middlewares/current-user'
import upload from '../../service/fileUplaod/multer'
import cloudinary from '../../service/fileUplaod/cloudinary'

const router =Router()

type PlanKey = keyof typeof plan;
const plan ={
    basic:{
        price:9,
        expireAt: new Date(Date.now() +  24 * 60 * 60 * 1000)
    },
    pro:{
        price:59,
        expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
    },
    enterprise:{
        price:299,
        expireAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) 
    }
}
router.post('/api/order',
    createAdValidate,
   validateRequest,
    currentUser,
    async (req:Request,res:Response)=>{
      
        const userId = req.currentUser?.id 

        if(!userId){
            throw new BadRequestError('User not authorised')
        }
        const existingAdvertiseCount = await Advertise.countDocuments(); 
        if(existingAdvertiseCount >=100) {
           throw new BadRequestError('Advertise limit reached')
        }
        console.log(req.body,'order data')
        const plansFromUser = req.body.advertisPlan as PlanKey; 
        console.log(plansFromUser,'plan from user')
        if(plansFromUser !== 'basic' && plansFromUser !== 'pro' && plansFromUser !== 'enterprise'){

            throw new BadRequestError('Invalid plan selected')
        }
        const planSelected = plan[plansFromUser];
        const order = Order.build({userId,orderData:req.body,totalPrice:planSelected.price,adExpireAt:planSelected.expireAt,createAt:new Date,status:'pending'})
        await order.save()
       
       
       
       const razorpayOrder=await instance.orders.create({
            amount:planSelected.price*100,
            currency:"USD",
            receipt:order.id
        })
        res.status(201).send({razorpayOrder,order})
    }
)
export { router as createOrderRouter}