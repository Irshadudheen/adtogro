import { Document, Model } from "mongoose";
interface User {
  socketId: string;
  name: string;
  userImage: string;
}
export interface RoomAttras{
    createrId:string,
    roomName:string,
    roomLanguage:string,
    roomDescription?:string,
    roomLevel:string,
   users: User[]; 
     messages?: {
    from: string;
    message: string;
    time: string;
  }[];
 
}

export interface RoomDoc extends Document{
    createrId:string,
    roomName:string,
    roomLanguage:string,
    roomDescription?:string,
    roomLevel:string,
   users: User[]; 
     messages?: {
    from: string;
    message: string;
    time: string;
  }[];
    
}
export interface RoomModel extends Model<RoomDoc>{
    build(attrs:RoomAttras):RoomDoc;
}