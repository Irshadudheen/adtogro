import React from 'react'
import { useRoomDetails } from '../../context/videoCallRoomContext/RoomDetailsContext'; 
import { Users } from 'lucide-react';
import { useSocket } from '../../context/videoCallRoomContext/useSocketContext';
function RoomHeader() {
    const { roomDetails } = useRoomDetails();
    const {usersInRoom} = useSocket()
  return (
    <div>
      <div className="bg-gray-700  p-4 flex justify-between items-center">
        <h2 className="text-xl text-white font-semibold">Group: {roomDetails&&roomDetails.roomName||'Group name'}</h2>
        <div className="flex items-center text-sm text-gray-300 bg-gray-800 px-3 py-1 rounded-full shadow-sm">Connected Users:  <Users size={14} className="mr-2 text-blue-400" /> {usersInRoom.length}/3</div>
        
      </div>
    </div>
  )
}

export default RoomHeader
