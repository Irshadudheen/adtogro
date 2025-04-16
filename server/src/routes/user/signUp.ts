import { Request, Response, Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { body } from "express-validator";
import { BadRequestError } from "../../errors/bad-request-error";
import { User } from "../../models/user";

import sendMail from "../../service/mail";
const router = Router();
router.post("/api/user/signup",[
    body('email').trim().isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min:6}).withMessage('Password must be at least 6 characters long'),

],validateRequest,
    async (req:Request, res:Response) => {
        const { email, password,name } = req.body;
    const existingUser = await User.findOne({email});
        if(existingUser && existingUser.is_verified){
            throw new BadRequestError('Email already in use')
        }
        if(existingUser && !existingUser.is_verified){
            sendMail({to:existingUser.email,type:'VERIFY_EMAIL',data:{name:existingUser.name,userId:existingUser._id}})
            throw new BadRequestError('Email already in use and please verify your email')
        }

    const user = User.build({email,password,name})
    await user.save()
  
   

    sendMail({to:user.email,type:'VERIFY_EMAIL',data:{name:user.name,userId:user._id}})
  
     res.status(201).send({user}); 
})
export { router as signUpRouter };