// import { Request, Response, Router } from "express";
// import { body } from "express-validator";
// import { validateRequest } from "../../middlewares/validateRequest";
// import jwt from 'jsonwebtoken'
// import { BadRequestError } from "../../errors/bad-request-error";
// import { UserAttrs } from "../../@types/UserAttras";
// import { User } from "../../models/user";
// import { Password } from "../../service/password";
// const router = Router();
// router.patch('/api/user/newPassword',[body('token').notEmpty().withMessage('Token is required'),body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')],validateRequest,
//  async (req:Request, res:Response) => {
//     const { password,token } = req.body;
//   const userData =await  jwt.verify(token, process.env.JWT_KEY!) as any
//    if(!userData){
//     throw new BadRequestError('Token is expiered or invalid')
//    }
//    console.log(userData,'The user data')
//    const user = await User.findOne({email:userData.user.email})
//    console.log(user,'The user data')

//    if(!user){
//     throw new BadRequestError('User not found')
//    }
   
//    user.password = password;
//     await user.save()
//     res.status(200).send({message:'Password updated successfully'})

   

 
// })
// export { router as newPasswordRouter }