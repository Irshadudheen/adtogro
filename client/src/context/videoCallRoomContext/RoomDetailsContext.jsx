import React, { createContext, useContext, useState } from "react";
import { roomDetailsApi } from "@/Api/user"; 
import { useNavigate, useParams } from "react-router-dom";
const RoomDetailsContext = createContext();

export const RoomDetailsProvider = ({ children }) => {
    const navigate = useNavigate()
  const [roomDetails, setRoomDetails] = useState(null);
  const { roomId } = useParams();
  const fetchRoomDetails = async () => {
    try {
      const data = await roomDetailsApi(roomId);
      setRoomDetails(data);
      console.log("Room details:", data);
    } catch (error) {
        navigate('/talkspace')
      console.error("Failed to fetch room details:", error);
    }
  };

  return (
    <RoomDetailsContext.Provider value={{ roomDetails, fetchRoomDetails }}>
      {children}
    </RoomDetailsContext.Provider>
  );
};

export const useRoomDetails = () => {
  const context = useContext(RoomDetailsContext);
  if (!context) {
    throw new Error("useRoomDetails must be used within a RoomDetailsProvider");
  }
  return context;
};
