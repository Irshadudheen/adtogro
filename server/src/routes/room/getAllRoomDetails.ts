import { Router } from "express";
import { rooms } from "../../RoomData/roomData";

const router = Router()
router.get('/api/rooms',(req,res)=>{
    console.log(rooms)
    const array = Object.keys(rooms).map((key) => ({
  id: key,
  ...rooms[key],
}));
    res.status(200).json(array)
})
export {router as getAllRoomDetailsRouter}