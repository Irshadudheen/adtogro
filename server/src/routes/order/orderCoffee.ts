import { Request, Response, Router } from "express";
import { currentUser } from "../../middlewares/current-user";
import { validateRequest } from "../../middlewares/validateRequest";
import { body } from "express-validator";
import { Coffee } from "../../models/coffee";
import { instance } from "../../payment_gateway/razorpay";

const router = Router()
router.post('/api/order/coffee',currentUser,[
    body('amount').trim().notEmpty().withMessage('Amount is required')
],validateRequest,
async(req:Request,res:Response)=>{
    const {amount,message} = req.body;
    const userId = req.currentUser?.id
    const coffee = await Coffee.create({amount,userId,message})
    const razorPayCofee=await instance.orders.create({
            amount:amount*100,
            currency:"USD",
            receipt:coffee.id
        })
    res.json({coffee,razorPayCofee})
})
export  { router as orderCoffeeRouter}