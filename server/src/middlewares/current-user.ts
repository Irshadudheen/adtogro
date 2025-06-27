import { NextFunction, Request, Response } from "express";


import { NotAuthorizedError } from "../errors/not-authorized-error";
import { userData } from "../interface/userInterface";
import { verifyToken } from "../service/jwt";
import { User } from "../models/user";

declare global {
    namespace Express{
        interface Request{
            currentUser?:userData;
        }
    }
}
export const currentUser = (req:Request,res:Response,next:NextFunction)=>{
    console.log('current user middleware called')
    console.log(req.headers?.authorization)
    if(!req.headers?.authorization){
      throw new NotAuthorizedError()
    }
    try {
  
        const payload = verifyToken(req.headers.authorization) ;
        const user = User.findOne({email:payload.email,block:false});
        if(!user){
            throw new NotAuthorizedError()
        }
        req.currentUser = payload;
        
    } catch (error) {

    throw new NotAuthorizedError()
    }
    next()
}