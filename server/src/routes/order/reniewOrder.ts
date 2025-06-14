import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { currentUser } from "../../middlewares/current-user";
import { Advertise } from "../../models/advertise";
import { BadRequestError } from "../../errors/bad-request-error";
import { plan, PlanKey } from "./createOrder";
import { Order } from "../../models/order";
import { instance } from "../../payment_gateway/razorpay";


const router = Router();
router.post('/api/order/renew/:id',[param('id').notEmpty().withMessage('advertise id is required'),
    body('advertisPlan').notEmpty().withMessage('advertise plan is required')
]
,validateRequest,currentUser,async(req:Request,res:Response)=>{
    const {id}=req.params
    const userId = req.currentUser?.id;
    if(!userId){
                throw new BadRequestError('User not authorised')
            }
    const existingAdvertiseCount = await Advertise.countDocuments(); 
        if(existingAdvertiseCount >=100) {
           throw new BadRequestError('Advertise limit reached')
        }
    const planFromUser = req.body.advertisPlan as PlanKey;
    if(planFromUser !== 'basic' && planFromUser !== 'pro' && planFromUser !== 'enterprise'){

            throw new BadRequestError('Invalid plan selected')
        } 
        
        const planSelected = plan[planFromUser]
    const advertise =await Advertise.findById(id)
    if(!advertise){
        throw new BadRequestError('advertise not found')
    }

  let newExpiryget
  if(planFromUser=='basic'){

     const expiresAt = new Date(advertise.expiresAt);
const newExpiry: Date = new Date(expiresAt); // clone to avoid mutation
newExpiry.setDate(newExpiry.getDate() + 1);
newExpiryget=newExpiry
  }else if (planFromUser=='pro'){
    const expiresAt = new Date(advertise.expiresAt);
const newExpiry: Date = new Date(expiresAt); // clone to avoid mutation
newExpiry.setDate(newExpiry.getDate() + 30);
newExpiryget=newExpiry
  }else if (planFromUser=='enterprise'){
    const expiresAt = new Date(advertise.expiresAt);
const newExpiry: Date = new Date(expiresAt); // clone to avoid mutation
newExpiry.setDate(newExpiry.getDate() + 180);
newExpiryget=newExpiry
  }
    const order = Order.build({userId,orderData:advertise,totalPrice:planSelected.price,adExpireAt:newExpiryget!,createAt:new Date,status:'pending'})
     await order.save()
    const razorpayOrder=await instance.orders.create({
            amount:planSelected.price*100,
            currency:"USD",
            receipt:order.id
        })
         res.status(201).send({razorpayOrder,order})
})
export {router as RenewAdRouter}