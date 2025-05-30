import { Request, Response, Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { body } from "express-validator";
import { User } from "../../models/user";
import jwt from 'jsonwebtoken'
import { createToken } from "../../service/jwt";
import { userData } from "../../interface/userInterface";


const router = Router();
router.post('/api/user/googleLogin',[body('email').isEmail().withMessage('Must provide email'),
    body('name').notEmpty().withMessage('User name is required'),body('picture').notEmpty().withMessage('picture not found')],validateRequest,
  async  (req:Request,res:Response)=>{
   
        const {email ,name , picture } = req.body;
        const cleanedUrl = picture.slice(0, -6);


        const user = await User.findOne({email}) as userData;

        if(user){
             const userJWT =await createToken(user) 
             
            res.status(200).json({user:user,token:userJWT})
        }else{
            
            const newUser = User.build({email,name,profileImage:cleanedUrl})
            
         const savedUser= await  newUser.save() as userData
            const userJWT = createToken(savedUser) 
            res.set('Cache-Control', 'private, max-age=300');
            res.status(200).send({user:savedUser,token:userJWT})
        }
})
export {router as googleAuthRouter}