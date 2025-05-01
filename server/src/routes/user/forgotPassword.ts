import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { User } from "../../models/user";
import { BadRequestError } from "../../errors/bad-request-error";
import jwt from 'jsonwebtoken'
import sendMail from "../../service/mail";
const router = Router();
router.post('/api/user/forgotPassword',[body('email').isEmail().withMessage('Email is required')],
validateRequest,
async (req:Request,res:Response)=>{
    const {email} = req.body;
    console.log(req.body)
    const user = await User.findOne({email});
    console.log(user)
    if(!user) {
         throw new BadRequestError('User not found')
    }
    const token= jwt.sign({user},process.env.JWT_KEY!,{expiresIn:'1h'})
    sendMail({to:user.email,type:'RESET PASSWORD',data:{name:user.name,token}})
    console.log(token)
    res.status(200).json({message:'Reset password link sent to your email'})

 })
export { router as forgotPasswordRouter };