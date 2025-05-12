import { Request, Response, Router } from "express";
import {v4 as uuidv4} from 'uuid'
import { rooms } from "../../RoomData/roomData";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
const router =Router();
router.post('/api/room',[body('roomName').notEmpty().withMessage('Group name is required'),
body('roomLanguage').notEmpty().withMessage('Group Language is required'),
body('roomDescription').notEmpty().withMessage('Group Description is required'),
body('roomLevel').notEmpty().withMessage('Proffiency level is required')],validateRequest,
(req:Request,res:Response)=>{
    const {roomName,roomLanguage,roomDescription,roomLevel} = req.body;
    const roomId = uuidv4();
    rooms[roomId]={
        users: [],
        userName: [],
        roomName,
        roomLanguage,
        roomDescription,
        roomLevel

    }
    res.status(200).json({roomId})
     
})
export {router as createRoomRouter}