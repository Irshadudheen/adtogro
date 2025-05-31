import { Router } from "express";

import { Room } from "../../models/room";

const router = Router();

router.get("/api/rooms", async (req, res) => {
  const page = Number(req.query.page as string) || 1;
  const limit = Number(req.query.limit as string) || 6; // Match frontend default
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

  const rooms = await Room.find(searchFilter)
    .sort({created_by_premium:-1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const totalRooms = await Room.countDocuments(searchFilter);
  const hasMore = page * limit < totalRooms;

  res.status(200).json({
    rooms,
    currentPage: page,
    total: totalRooms,
    hasMore
  });
});

export { router as getAllRoomDetailsRouter };
