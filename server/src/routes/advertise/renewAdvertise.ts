import { Router } from "express";
import { currentUser } from "../../middlewares/current-user";
import { Advertise } from "../../models/advertise";
import { BadRequestError } from "../../errors/bad-request-error";
import { Order } from "../../models/order";

const router = Router()
router.put('/api/advertise/renew/:id',currentUser,async(req,res)=>{
const {id}=req.params
const advertise = await Advertise.findById(id)
if(!advertise){
    throw new BadRequestError('advertise not found')
}
console.log(req.body,'the body data of renew')
const order =await Order.findById(req.body.order_id)
 if(!order){
            throw new BadRequestError('Order not found')
        }
    order.status = 'completed'
        await order.save();
        advertise.expiresAt=order.adExpireAt
      await  advertise.save()
      console.log(advertise,'the data of advertise')
      res.send(advertise)
})
export {router as renewAdUpdateRouter}