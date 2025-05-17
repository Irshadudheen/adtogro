import { Router } from "express";
import  rooms  from "../../RoomData/roomData";

const router = Router();

router.get("/api/rooms", (req, res) => {
  const allRooms = Object.keys(rooms).map((key) => ({
    id: key,
    ...rooms[key],
  }));

  // Optional: Handle pagination
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || allRooms.length;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedRooms = allRooms.slice(startIndex, endIndex);

  res.status(200).json({
    rooms: paginatedRooms,
    currentPage: page,
    total: allRooms.length,
    hasMore: endIndex < allRooms.length,
  });
});

export { router as getAllRoomDetailsRouter };
