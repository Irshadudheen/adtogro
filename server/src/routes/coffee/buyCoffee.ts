import { Request, Response, Router } from "express";
import { currentUser } from "../../middlewares/current-user";
import { body } from "express-validator";
import { User } from "../../models/user";
import { Coffee } from "../../models/coffee";
import sendMail from "../../service/mail";
import { validateRequest } from "../../middlewares/validateRequest";
import { BadRequestError } from "../../errors/bad-request-error";

const router = Router()
router.post('/api/coffee',currentUser,[body('amount').isNumeric().withMessage('give valid amount')],validateRequest,
async (req:Request,res:Response)=>{
    const { amount  }= req.body;
    const userId = req.currentUser?.id as string;
    const user = await User.findById(userId);
    if(!user){
        throw new BadRequestError('User not found');
    }
    user.is_premium = true;
    await user.save();
    const coffee =await Coffee.create({amount,userId});
    res.status(201).json(coffee);
    // sendMail({to:user.email,type:'COFFEE_PURCHASED',data:{name:user.name,amount:coffee.amount}})
})
export { router as buyCoffeeRouter };