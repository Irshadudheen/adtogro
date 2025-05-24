import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { currentUser } from "../../middlewares/current-user";
import { Room } from "../../models/room";
const router =Router();
router.post('/api/room',[body('roomName').notEmpty().isString().withMessage('Group name is required'),
body('roomLanguage').notEmpty().isString().trim().withMessage('Group Language is required'),
body('roomDescription').notEmpty().isString().withMessage('Group Description is required'),
body('roomLevel').notEmpty().withMessage('Proffiency level is required')],validateRequest,
currentUser,
(req:Request,res:Response)=>{
    const {roomName,roomLanguage,roomDescription,roomLevel} = req.body;


   const room= Room.build({roomName,roomLanguage,roomLevel,roomDescription,users:[],createrId:req.currentUser?.id!})
room.save()
    // rooms[roomId]={
    //     groupCreaterId:req.currentUser?.id!,
    //     users: [],
    //     userName: [],
    //     roomName,
    //     roomLanguage,
    //     roomDescription,
    //     roomLevel

    // }

    res.status(200).json({roomId:room.id})
     
})
export {router as createRoomRouter}