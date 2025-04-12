import { Request, Response, Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { body } from "express-validator";
import { BadRequestError } from "../../errors/bad-request-error";
import { User } from "../../models/user";
import jwt from 'jsonwebtoken'
const router = Router();
router.post("/api/user/signup",[
    body('email').trim().isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min:6}).withMessage('Password must be at least 6 characters long'),

],validateRequest,
    async (req:Request, res:Response) => {
        const { email, password } = req.body;
    const existingUser = await User.findOne({email});

    if(existingUser){
       throw new BadRequestError('Email in use')

    }
    const user = User.build({email,password})
    await user.save()
  
    const userJwt =jwt.sign({
        id:user._id,
        email:user.email
    },process.env.JWT_KEY!)

    
  
     res.status(201).send({user,    token:userJwt}); 
})
export { router as signUpRouter };