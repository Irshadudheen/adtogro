import { NextFunction, Request, Response } from "express";


import { NotAuthorizedError } from "../errors/not-authorized-error";
import { userData } from "../interface/userInterface";
import { verifyToken } from "../service/jwt";

declare global {
    namespace Express{
        interface Request{
            currentUser?:userData;
        }
    }
}
export const currentUser = (req:Request,res:Response,next:NextFunction)=>{
    if(!req.headers?.authorization){
      throw new NotAuthorizedError()
    }
    try {
        const payload = verifyToken(req.headers.authorization) ;
        req.currentUser = payload;
        
    } catch (error) {

    throw new NotAuthorizedError()
    }
    next()
}