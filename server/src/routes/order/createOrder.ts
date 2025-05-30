import {Request, Response, Router} from 'express'

import { createAdValidate } from '../../validators/createAdValidate'
import { validateRequest } from '../../middlewares/validateRequest'
import { Advertise } from '../../models/advertise'
import { BadRequestError } from '../../errors/bad-request-error'
import { instance } from '../../payment_gateway/razorpay'
import { Order } from '../../models/order'
import { currentUser } from '../../middlewares/current-user'
const router =Router()
router.post('/api/order',createAdValidate,validateRequest,
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
        const order = Order.build({userId,orderData:req.body,totalPrice:4000,createAt:new Date,status:'pending'})
        await order.save()
       
       
       
       const razorpayOrder=await instance.orders.create({
            amount:4000*100,
            currency:"INR",
            receipt:order.id
        })
        res.status(201).send({razorpayOrder,order})
    }
)
export { router as createOrderRouter}