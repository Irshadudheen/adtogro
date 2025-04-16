import { Request, Response, Router } from "express";
import { param } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { User } from "../../models/user";
import { BadRequestError } from "../../errors/bad-request-error";
import jwt from 'jsonwebtoken'
const router = Router();
router.post("/api/user/verify-email/:userId",[
    param('userId').isMongoId().withMessage('User Id not found')],validateRequest,
     async (req:Request, res:Response) => {
  const { userId } = req.params;
  const user =await User.findById(userId)
  if(!user) {
    throw new BadRequestError("User not found")
  }
  if(user.is_verified) {
    throw new BadRequestError("User already verified")
  }
  user.is_verified = true;
  await user.save();
    const userJWT = jwt.sign({
          id: user.id,
          email: user.email
       
      }, process.env.JWT_KEY!)
 
  res.status(200).json({ message: "Email verified successfully" ,token:userJWT,userData:user});
})
export { router as verifyEmailRouter };