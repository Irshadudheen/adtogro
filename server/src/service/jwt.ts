import { BadRequestError } from "../errors/bad-request-error";

import jwt from 'jsonwebtoken';
import { userData } from "../interface/userInterface";
export const createToken =(userData:userData)=>{
    const token =  jwt.sign({email:userData.email,id:userData.id,profileImage:userData.profileImage,name:userData.name},process.env.JWT_KEY!,{
        expiresIn: '7d'}) 
        console.log(token,'the token')
        return token
}
export const verifyToken = (token:string)=>{
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY!) as userData;
        console.log(decoded,'decoded token')
        return decoded
    } catch (error) {
        throw new BadRequestError('token expired')
    }
}