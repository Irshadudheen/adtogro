import { Router } from "express";

import { Room } from "../../models/room";

const router = Router();

router.get("/api/rooms",async (req, res) => {
        const page = Number(req.query.currentPage as string) || 1;
        const limit = Number(req.query.limit as string) || 9;
        const skip = (page - 1) * limit;
        const search = req.query.search as string;
        const searchFilter = search
  ? {
      $or: [
        { roomName: { $regex: search, $options: 'i' } },
        { roomDescription: { $regex: search, $options: 'i' } },
        { roomLanguage: { $regex: search, $options: 'i' } },
        { roomLevel: { $regex: search, $options: 'i' } },
      ],
    }
  : {};
      
        
       const   Rooms = await Room.find(searchFilter).sort({createdAt:-1}).skip(skip).limit(limit)
 const  totalRooms = await Room.countDocuments(searchFilter)
        const hasMore = page * limit <totalRooms
  
 



  res.status(200).json({
    rooms:Rooms,
    currentPage: page,
    total: totalRooms,
    hasMore
  });
});

export { router as getAllRoomDetailsRouter };
