import { Router } from "express";
import { rooms } from "../../RoomData/roomData";
import { BadRequestError } from "../../errors/bad-request-error";

const router = Router();
router.get('/api/room/:roomId', (req,res)=>{
    const {roomId} = req.params;
    const room = rooms[roomId];
    if(!room){
        throw new BadRequestError('Room not found')
    }
    console.log(room)
    res.status(200).json(room)
})
export {router as getRoomDetailsRouter}