import { Router } from "express";

import { BadRequestError } from "../../errors/bad-request-error";
import { Room } from "../../models/room";

const router = Router();
router.get('/api/room/:roomId', async(req,res)=>{
    const {roomId} = req.params;
    const room =await Room.findById(roomId)
    if(!room){
        throw new BadRequestError('Room not found')
    }
 
    res.status(200).json(room)
})
export {router as getRoomDetailsRouter}