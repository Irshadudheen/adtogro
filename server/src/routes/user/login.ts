import { Request, Response, Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { body } from "express-validator";
import { Password } from "../../service/password";
import { User } from "../../models/user";
import jwt from 'jsonwebtoken'
import { BadRequestError } from "../../errors/bad-request-error";
import sendMail from "../../service/mail";

const router = Router();
router.post("/api/user/login",[body("password").trim().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("email").trim().isEmail().withMessage("Email must be valid"),
] ,validateRequest,
   async (req:Request, res:Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError('Email not found');
    }
    if (!existingUser.is_verified) {
         sendMail({to:existingUser.email,type:'VERIFY_EMAIL',data:{name:existingUser.name,userId:existingUser._id}})
        throw new BadRequestError('Email not verified now please check in your email and verify it')
    }
    
    const passwordsMatch= await Password.compare(
        existingUser.password,
        password
    )
    if (!passwordsMatch) {
        throw new BadRequestError('password not match')
    }
    const userJWT = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!)
   
   
    
    res.status(200).send({user:existingUser,token:userJWT});
  
});
export { router as loginRouter };