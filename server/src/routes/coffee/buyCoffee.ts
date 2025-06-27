import { Request, Response, Router } from "express";
import { currentUser } from "../../middlewares/current-user";
import { body, param } from "express-validator";
import { User } from "../../models/user";
import { Coffee } from "../../models/coffee";
import sendMail from "../../service/mail";
import { validateRequest } from "../../middlewares/validateRequest";
import { BadRequestError } from "../../errors/bad-request-error";

const router = Router()
router.post('/api/coffee/:id',currentUser,[param('id').trim().notEmpty().isMongoId().withMessage('Must provide coffee ID')],validateRequest,
async (req:Request,res:Response)=>{
    const userId = req.currentUser?.id
    const { id }= req.params;
    const coffee =await Coffee.findById(id).populate('userId');
if(!coffee){
    throw new BadRequestError('coffee not found')
}

    coffee.status='completed'
    await coffee.save()
    const user = await User.findById(userId);
    if(!user){
        throw new BadRequestError('User not found');
    }
    user.is_premium = true;
    await user.save();
   
    res.status(201).json(coffee);
    // sendMail({to:user.email,type:'COFFEE_PURCHASED',data:{name:user.name,amount:coffee.amount}})
})
export { router as buyCoffeeRouter };