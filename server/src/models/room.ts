import { model, Schema } from "mongoose";
import { RoomAttras, RoomDoc, RoomModel } from "../@types/Room.Attras";
const userSchema = new Schema({
  socketId: String,
  name: String,
  userImage: String,
});

const messageSchema = new Schema({
  from: String,
  message: String,
  time: String,
  userData: {
    socketId: String,
    name: String,
    userImage: String,
  }
});
const roomSchema= new Schema({
    createrId:{required:true,type:Schema.Types.ObjectId,ref:'User'},
    roomName:{required:true,type:String},
    roomLanguage:{required:true,type:String},
    roomDescription:{type:String},
    roomLevel:{type:String,required:true},
      users: [userSchema], // ✅ Add this line
  messages: [messageSchema], 
    message:[{from:{type:String},
        message:{type:String},
        time:{type:String}}],
        createdAt: {
    type: Date,
    default: Date.now
  }
},{toJSON:{transform(doc,ret){
    ret.id=ret._id;
    delete ret._id;
    delete ret.__v
}}})

roomSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

roomSchema.index({
  roomName: 'text',
  roomDescription: 'text',
  roomLanguage: 'text',
  roomLevel: 'text'
});
roomSchema.index({ roomLanguage: 1, roomLevel: 1, createdAt: -1 });

roomSchema.statics.build=(attrs:RoomAttras)=>{
    return new Room(attrs)
}
const Room = model<RoomDoc,RoomModel>('Room',roomSchema);
export {Room}