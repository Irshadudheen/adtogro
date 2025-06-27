import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import mongoose from 'mongoose';

// Import models and services
import { Room, MessageAttrs, RoomDoc } from '../models/room';
import { verifyToken } from '../service/jwt';
import { SocketNotInitializedError } from '../errors/socket-not-init-error';
import { userData } from '../interface/userInterface';
import { io } from '../index';

// Types definitions for better type safety
interface CustomSocket extends Socket {
  roomId?: string | null;
  userId?: string | null;
}

// Socket connection tracking
interface UserSocketMap {
  [userId: string]: string[]; // Array of socket IDs belonging to each user
}

/**
 * Socket server for group video calls
 */
export class VideoCallSocketServer {
  private io: Server;
  private userSockets: UserSocketMap = {};
  private readonly MAX_USERS_PER_ROOM = 3;
  private readonly MAX_MESSAGES = 50;
  private readonly ROOM_DELETION_DELAY = 60_000; // 1 minute

  /**
   * Initialize the video call socket server
   * @param io - Socket.io server instance
   * @throws SocketNotInitializedError if io is not provided
   */
  constructor(io: Server) {
    if (!io) {
      throw new SocketNotInitializedError();
    }
    this.io = io;
    this.setupEventHandlers();
  }

  /**
   * Set up main socket connection event handler
   */
  private setupEventHandlers(): void {
    this.io.on('connection', (socket: CustomSocket) => {
      console.log(`👤 User connected: ${socket.id}`);
      
      // Send socket ID to the client
      socket.emit('me', socket.id);

      // Set up event listeners for this socket
      this.setupSocketEvents(socket);
    });
  }

  /**
   * Set up event listeners for a specific socket
   * @param socket - The connected socket
   */
  private setupSocketEvents(socket: CustomSocket): void {
    socket.on('join_room', (roomId, token) => this.handleJoinRoom(socket, roomId, token));
    socket.on('offer', (data) => this.handleOffer(socket, data));
    socket.on('answer', (data) => this.handleAnswer(socket, data));
    socket.on('ice_candidate', (data) => this.handleIceCandidate(socket, data));
    socket.on('user_video_toggle', (data) => this.handleVideoToggle(socket, data));
    socket.on('chat_message', (data) => this.handleChatMessage(socket, data));
    socket.on('leave_room', () => this.handleLeaveRoom(socket));
    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  /**
   * Handle a user joining a room
   * @param socket - The user's socket
   * @param roomId - The room ID to join
   * @param token - JWT authentication token
   */
  private async handleJoinRoom(socket: CustomSocket, roomId: string, token: string): Promise<void> {
    try {
      console.log(`🚪 User ${socket.id} attempting to join room: ${roomId}`);
      
      // Validate roomId
      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        socket.emit('room_not_found');
        console.log(`❌ Invalid room ID: ${roomId}`);
        return;
      }
      if(!token){
        socket.emit('room_not_found');
        console.log(`❌ token not found ${token}`)
        return
      }

      // Verify user token
      const user = verifyToken(token) as userData;
      if (!user || !user.id) {
        socket.emit('authentication_error');
        console.log(`❌ Invalid authentication token`);
        return;
      }

      const userId = user.id;
      socket.userId = userId;
      
      // Track this socket under the user's ID
      this.trackUserSocket(userId, socket.id);
      
      // Get room info
      const room = await Room.findById(roomId);
      if (!room) {
        socket.emit('room_not_found');
        console.log(`❌ Room not found: ${roomId}`);
        return;
      }

      // Check if user is already in this room from another socket
      const existingSocketInRoom = this.isUserInRoom(room, userId);
      
      // Check room capacity
      if (room.users.length >= this.MAX_USERS_PER_ROOM && !existingSocketInRoom) {
        socket.emit('room_full');
        console.log(`🚫 Room ${roomId} is full`);
        return;
      }

      // Check if this socket is already in the room
      if (room.users.some(user => user.socketId === socket.id)) {
        console.log(`📌 Socket ${socket.id} is already in room ${roomId}`);
        return;
      }

      // Join the socket to the room
      socket.join(roomId);
      socket.roomId = roomId;
      
      await this.updateRoomUsers(socket, room, user, existingSocketInRoom);
      
      console.log(`✅ User ${socket.id} joined room ${roomId}`);
      console.log(`👥 Room ${roomId} users: ${JSON.stringify(room.users)}`);
    } catch (error) {
      console.error(`❌ Error joining room:`, error);
      socket.emit('server_error', { message: 'Failed to join room' });
    }
  }
  
  /**
   * Update the room's user list when a user joins
   */
  private async updateRoomUsers(
    socket: CustomSocket, 
    room: mongoose.Document<unknown, {}, any> & any, 
    user: any, 
    existingSocketInRoom: boolean
  ): Promise<void> {
    // If user is already in room from another socket
    if (existingSocketInRoom) {
      this.handleUserSwitchingTabs(socket, room, user);
    } else {
      // First time user is joining this room
      room.users.push({
        socketId: socket.id,
        userImage: user.profileImage,
        name: user.name,
        userId: user.id
      });
    }
    
    await room.save();
     io.emit("room:updated", room)
    
    // Notify all users in the room about current participants
    this.io.to(room._id.toString()).emit('users_in_room', room.users);
    
    // Send join message
    this.sendJoinMessage(socket, room, user, existingSocketInRoom);
    
    // Send chat history to the joining user
    if (room.messages && room.messages.length > 0) {
      socket.emit('chat_history', room.messages);
    }
    
    // Request WebRTC offers from existing users if new user
    if (!existingSocketInRoom) {
      this.requestOffersFromExistingUsers(socket, room);
    }
  }
  
  /**
   * Handle case when user joins from another tab/device
   */
  private handleUserSwitchingTabs(socket: CustomSocket, room: any, user: any): void {
    console.log(`📱 User ${user.id} is joining from another tab/device`);
    
    // Notify existing sockets of this user about the switch
    const userExistingSockets = this.userSockets[user.id].filter(sid => sid !== socket.id);
    userExistingSockets.forEach(sid => {
      this.io.to(sid).emit('user_switched_tab', {
        message: 'You opened this room in another tab/window'
      });
    });
    
    // Update the socket ID for this user
    for (let i = 0; i < room.users.length; i++) {
      if (room.users[i].userId === user.id) {
        room.users[i].socketId = socket.id;
        break;
      }
    }
  }
  
  /**
   * Send room join notification message
   */
  private sendJoinMessage(socket: CustomSocket, room: any, user: any, existingSocketInRoom: boolean): void {
    if (!existingSocketInRoom) {
      // New user joining the room
      socket.to(room._id.toString()).emit('chat_message', {
        from: 'system',
        message: `User ${user.name} joined the room`,
        userData: user
      });
    } else {
      // User switching tabs
      socket.to(room._id.toString()).emit('chat_message', {
        from: 'system',
        message: `User ${user.name} switched to another tab/device`,
      });
    }
  }
  
  /**
   * Request WebRTC offers from existing users
   */
  private requestOffersFromExistingUsers(
    socket: CustomSocket, 
    room: RoomDoc
  ): void {
    const usersInRoom = room.users.filter(user => user.socketId !== socket.id);
    usersInRoom.forEach(user => {
      console.log(`🔄 Requesting offer from ${user.socketId} to ${socket.id}`);
      this.io.to(user.socketId).emit('offer_request', { from: socket.id });
    });
  }

  /**
   * Handle WebRTC offer
   */
  private handleOffer(socket: CustomSocket, { to, offer }: { to: string; offer: unknown }): void {
    console.log(`📤 Forwarding offer from ${socket.id} to ${to}`);
    this.io.to(to).emit('offer', { from: socket.id, offer });
  }

  /**
   * Handle WebRTC answer
   */
  private handleAnswer(socket: CustomSocket, { to, answer }: { to: string; answer: unknown }): void {
    console.log(`📥 Forwarding answer from ${socket.id} to ${to}`);
    this.io.to(to).emit('answer', { from: socket.id, answer });
  }

  /**
   * Handle ICE candidate
   */
  private handleIceCandidate(
    socket: CustomSocket, 
    { to, candidate }: { to: string; candidate: RTCIceCandidate | unknown }
  ): void {
    this.io.to(to).emit('ice_candidate', { from: socket.id, candidate });
  }

  /**
   * Handle video toggle event
   */
  private handleVideoToggle(
    socket: CustomSocket,
    { roomId, socketId, isVideoOff, user }: { 
      roomId: string; 
      socketId: string; 
      isVideoOff: boolean; 
      user: any 
    }
  ): void {
    socket.to(roomId).emit('user_video_toggle', { socketId, isVideoOff, user });
  }

  /**
   * Handle chat message
   */
  private async handleChatMessage(
    socket: CustomSocket, 
    { roomId, message }: { roomId: string; message: string }
  ): Promise<void> {
    try {
      if (!roomId || !socket.userId) return;
      
      const room = await Room.findById(roomId);
      if (!room) return;

      console.log(`💬 Chat message from ${socket.id} in room ${roomId}`);
      
      const userData = room.users.find(user => user.socketId === socket.id);
      
      const formattedMessage: any = {
        from: socket.id,
        message,
        time: new Date().toISOString(),
        userData
      };

      // Add message to room history
      if (!room.messages) {
        room.messages = [];
      }

      room.messages.push(formattedMessage);

      // Limit message history size
      if (room.messages.length > this.MAX_MESSAGES) {
        room.messages.shift();
      }

      await room.save();

      // Broadcast message to other users in the room
      socket.to(roomId).emit('chat_message', {
        from: socket.id,
        message,
        userData
      });
    } catch (error) {
      console.error(`❌ Error sending chat message:`, error);
    }
  }

  /**
   * Handle user leaving a room
   */
  private handleLeaveRoom(socket: CustomSocket): void {
    console.log(`🚶 User ${socket.id} leaving room`);
    this.removeUserFromRoom(socket);
  }

  /**
   * Handle socket disconnection
   */
  private handleDisconnect(socket: CustomSocket): void {
    console.log(`❌ User disconnected: ${socket.id}`);
    
    // Remove this socket from userSockets tracking
    if (socket.userId && this.userSockets[socket.userId]) {
      this.userSockets[socket.userId] = this.userSockets[socket.userId].filter(
        sid => sid !== socket.id
      );
      
      // If user has no more sockets, delete the entry
      if (this.userSockets[socket.userId].length === 0) {
        delete this.userSockets[socket.userId];
      }
    }
    
    this.removeUserFromRoom(socket);
  }

  /**
   * Remove a user from their current room
   */
  private async removeUserFromRoom(socket: CustomSocket): Promise<void> {
    try {
      const roomId = socket.roomId;
      const userId = socket.userId;
      
      if (!roomId) return;
      
      const room = await Room.findById(roomId);
      if (!room) return;
      
      console.log(`🔄 Removing socket ${socket.id} from room ${roomId}`);
      const leavingUserData = room.users.find(user => user.socketId === socket.id);
      
      if (!leavingUserData) return;
      
      // Check if user has other active sockets in this room
      const userHasOtherSocketsInRoom = this.checkForOtherUserSocketsInRoom(userId!, socket.id, roomId);
      
      if (userHasOtherSocketsInRoom) {
        await this.handleUserWithMultipleTabs(userId!, socket.id, room, roomId);
      } else {
        await this.handleUserFullyLeaving(socket, room, roomId, leavingUserData);
      }

      socket.leave(roomId);
      socket.roomId = null;
    } catch (error) {
      console.error(`❌ Error removing user from room:`, error);
    }
  }

  /**
   * Handle case when user still has other tabs open in the room
   */
  private async handleUserWithMultipleTabs(
    userId: string | undefined, 
    socketId: string, 
    room: mongoose.Document<unknown, {}, any> & any, 
    roomId: string
  ): Promise<void> {
    if (!userId) return;
    
    console.log(`📱 User ${userId} still has other tabs open in this room`);
    
    // Find the remaining socket ID
    const remainingSocketId = this.userSockets[userId].find(sid => 
      sid !== socketId && this.io.sockets.sockets.get(sid)?.rooms.has(roomId)
    );
    
    if (remainingSocketId) {
      // Update the socket ID for this user
      for (let i = 0; i < room.users.length; i++) {
        if (room.users[i].userId === userId) {
          room.users[i].socketId = remainingSocketId;
          break;
        }
      }
      await room.save();
      
      // Don't send leave message since user is still in the room
      this.io.to(roomId).emit('users_in_room', room.users);
    }
  }

  /**
   * Handle case when user is fully leaving the room
   */
  private async handleUserFullyLeaving(
    socket: CustomSocket, 
    room: RoomDoc, 
    roomId: string,
    leavingUserData: any
  ): Promise<void> {
    // This was the user's last socket in this room, fully remove them
    room.users = room.users.filter(user => user.socketId !== socket.id);
    await room.save();
    io.emit("room:updated", room)
    // Send system message about user leaving
    this.io.to(roomId).emit('chat_message', {
      from: 'system',
      message: `User ${leavingUserData.name} left the room`,
    });

    // Notify other users
    this.io.to(roomId).emit('user_left', socket.id, leavingUserData.name);
    this.io.to(roomId).emit('users_in_room', room.users);

    // Handle empty room
    if (room.users.length === 0) {
      this.scheduleRoomDeletion(roomId);
    }
  }

  /**
   * Schedule a room for deletion if it remains empty
   */
  private scheduleRoomDeletion(roomId: string): void {
    console.log(`⏳ Room ${roomId} is empty, scheduling deletion in 1 minute`);
    
    setTimeout(async() => {
      try {
        const currentRoom = await Room.findById(roomId);
        if (currentRoom && currentRoom.users.length === 0) {
          console.log(`🗑️ Deleting room ${roomId} after 1 minute of inactivity`);
          io.emit("room:deleted", roomId);
          await Room.findByIdAndDelete(roomId);
        } else {
          console.log(`👥 Room ${roomId} is no longer empty, not deleting`);
        }
      } catch (error) {
        console.error(`❌ Error deleting room:`, error);
      }
    }, this.ROOM_DELETION_DELAY);
  }

  /**
   * Track a user's socket connection
   */
  private trackUserSocket(userId: string, socketId: string): void {
    if (!this.userSockets[userId]) {
      this.userSockets[userId] = [];
    }
    this.userSockets[userId].push(socketId);
  }

  /**
   * Check if a user is already in a room
   */
  private isUserInRoom(
    room: RoomDoc, 
    userId: string
  ): boolean {
    return room.users.some(user => user.userId === userId);
  }

  /**
   * Check if user has other sockets currently in the room
   */
  private checkForOtherUserSocketsInRoom(
    userId: string | undefined, 
    currentSocketId: string, 
    roomId: string
  ): boolean {
    return Boolean(
      userId && 
      this.userSockets[userId] && 
      this.userSockets[userId].length > 1 && 
      this.userSockets[userId].some(sid => {
        return sid !== currentSocketId && this.io.sockets.sockets.get(sid)?.rooms.has(roomId);
      })
    );
  }
}

/**
 * Initialize socket server for group video calls
 * @param io - Socket.io server instance
 * @returns Socket.io server instance
 * @throws SocketNotInitializedError if io is not provided
 */
export const initializeGroupVideoCallSocket = (io: Server): Server => {
  new VideoCallSocketServer(io);
  return io;
};