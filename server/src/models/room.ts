import { model, Schema, Document, Model } from "mongoose";

/**
 * User interfaces for room participants
 */
interface UserAttrs {
  socketId: string;
  name: string;
  userImage: string;
  userId: string;
}

interface UserDoc extends Document {
  socketId: string;
  name: string;
  userImage: string;
  userId: string;
}

/**
 * Message interfaces for room chat
 */
export interface MessageAttrs {
  from: string;
  message: string;
  time: string;
  userData?: {
    socketId: string;
    name: string;
    userImage: string;
    userId?: string;
  };
}

export interface MessageDoc extends Document {
  from: string;
  message: string;
  time: string;
  userData?: {
    socketId: string;
    name: string;
    userImage: string;
    userId?: string;
  };
}

/**
 * Room interfaces for video chat rooms
 */
export interface RoomAttrs {
  created_by_premium: boolean;
  createrId: string;
  roomName: string;
  roomLanguage: string;
  roomDescription?: string;
  roomLevel: string;
  users?: UserAttrs[];
  messages?: MessageAttrs[];
}

export interface RoomDoc extends Document {
  created_by_premium: boolean;
  createrId: string;
  roomName: string;
  roomLanguage: string;
  roomDescription?: string;
  roomLevel: string;
  users: UserDoc[];
  messages: MessageDoc[];
  createdAt: Date;
  id: string;
}

export interface RoomModel extends Model<RoomDoc> {
  build(attrs: RoomAttrs): RoomDoc;
}

/**
 * Schema definitions
 */
const userSchema = new Schema({
  socketId: { type: String, required: true },
  name: { type: String, required: true },
  userImage: { type: String },
  userId: { type: String, required: true }
}, {
  _id: false // Prevent Mongoose from creating _id for subdocuments
});

const messageSchema = new Schema({
  from: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, required: true },
  userData: {
    socketId: String,
    name: String,
    userImage: String,
    userId: String
  }
}, {
  _id: false // Prevent Mongoose from creating _id for subdocuments
});

const roomSchema = new Schema({
  createrId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_by_premium:{
    type: Boolean,
    required: true,
  }
  ,
  roomName: {
    type: String,
    required: true,
    trim: true
  },
  roomLanguage: {
    type: String,
    required: true,
    trim: true
  },
  roomDescription: {
    type: String,
    trim: true
  },
  roomLevel: {
    type: String,
    required: true,
    trim: true
  },
  users: [userSchema],
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

/**
 * Set up MongoDB TTL index to automatically delete rooms after 24 hours
 */
roomSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

/**
 * Create text index for search functionality
 */
roomSchema.index({
  roomName: 'text',
  roomDescription: 'text',
  roomLanguage: 'text',
  roomLevel: 'text'
});

/**
 * Create compound index for efficient filtering and sorting
 */
roomSchema.index({ 
  roomLanguage: 1, 
  roomLevel: 1, 
  createdAt: -1 
});

/**
 * Static method to create a new room with type safety
 */
roomSchema.statics.build = function(attrs: RoomAttrs): RoomDoc {
  return new Room(attrs);
};

const Room = model<RoomDoc, RoomModel>('Room', roomSchema);

export { Room };