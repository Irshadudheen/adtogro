
interface Room {
    users: string[];
   userName:string[];
    roomName: string;
    roomLanguage: string;
    roomDescription: string;
    roomLevel:string
    messages?: {
      from: string;
      message: string;
      time: string;
    }[];
  }
  export const rooms: Record<string, Room> = {};