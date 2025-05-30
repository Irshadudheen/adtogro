import { Router } from "express";
import { Room } from "../../models/room";

const router = Router();
router.get('/api/totalRoom',async (req,res)=>{
    const roomCount = await Room.countDocuments();
    console.log("Room Count:", roomCount);
    res.status(200).send({roomCount})
})
export { router as roomCountRouter };