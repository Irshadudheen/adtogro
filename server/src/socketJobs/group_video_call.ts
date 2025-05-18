import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { SocketNotInitializedError } from '../errors/socket-not-init-error';
import  {Room}  from '../models/room';
import { verifyToken } from '../service/jwt';

// Extend Socket to include custom properties
interface CustomSocket extends Socket {
  roomId?: string | null;
}



// Initialize Socket Server
export const initializeGroupVideoCallSocket = (io:Server) => {
    if (!io) {
        throw new SocketNotInitializedError();
    }

  const MAX_USERS_PER_ROOM = 3;


  io.on('connection', (socket: CustomSocket) => {
    console.log(`User connected: ${socket.id}`);

    // Send socket ID to the client
    socket.emit('me', socket.id);

    // Handle room joining
    socket.on('join_room',async (roomId: string,token:string) => {
      console.log(token)
     const user =verifyToken(token)
    console.log(user,'the user token')
      console.log(`User ${socket.id} attempting to join room: ${roomId}`);
      const room =await Room.findById(roomId)
      if (!room) {
        // rooms[roomId] = { users: [], userName:[userName]  };
        // console.log(`Room ${roomId} created`);
        socket.emit('room_not_found');
        return;
      }

      if (room.users.length >= MAX_USERS_PER_ROOM) {
        console.log(`Room ${roomId} is full`);
        socket.emit('room_full');
        return;
      }

      if (room.users.some(user =>user.socketId==socket.id)) {
        console.log(`User ${socket.id} is already in room ${roomId}`);
        return;
      }

      socket.join(roomId);
      room.users.push({socketId:socket.id,userImage:user.profileImage,name:user.name});
      await room.save()
      // rooms[roomId].userName.push()
      socket.roomId = roomId;

      console.log(`User ${socket.id} joined room ${roomId}`);
      console.log(`Room ${roomId} users: ${room.users}`);

      // Notify users
      io.to(roomId).emit('users_in_room', room.users);

      socket.to(roomId).emit('chat_message', {
        from: 'system',
        message: `User ${socket.id.substring(0, 5)} joined the room`,
      });

      // Send recent messages
      if (room.messages && room.messages.length > 0) {
        socket.emit('chat_history', room.messages);
      }

      // Request offers from existing users
      const usersInRoom = room.users.filter(user => user.socketId !== socket.id);
      usersInRoom.forEach(user => {
        console.log(`Requesting offer from ${user.socketId} to ${socket.id}`);
        io.to(user.socketId).emit('offer_request', { from: socket.id });
      });
    });

    // Handle WebRTC signaling

    socket.on('offer', ({ to, offer }: { to: string; offer: any }) => {
      console.log(`Forwarding offer from ${socket.id} to ${to}`);
      io.to(to).emit('offer', { from: socket.id, offer });
    });

    socket.on('answer', ({ to, answer }: { to: string; answer: any }) => {
      console.log(`Forwarding answer from ${socket.id} to ${to}`);
      io.to(to).emit('answer', { from: socket.id, answer });
    });

    socket.on('ice_candidate', ({ to, candidate }: { to: string; candidate: any }) => {
      
      io.to(to).emit('ice_candidate', { from: socket.id, candidate });
    });

    // Handle chat messages
    socket.on('chat_message',async ({ roomId, message }: { roomId: string; message: string }) => {
      const room =await Room.findById(roomId)
      if (!roomId || !room) return;

      console.log(`Chat message from ${socket.id} in room ${roomId}: ${message}`);
      const userData = room.users.find(user=>{
        if(user.socketId==socket.id){
          return user
        }
      })
      console.log(userData,'the user deatil in chat')
      const formattedMessage = {
        from: socket.id,
        message,
        time: new Date().toISOString(),
        userData
      };

      if (!room.messages) {
        room.messages = [];
      }

      room.messages.push(formattedMessage);

      if (room.messages.length > 50) {
        room.messages.shift();
      }

      socket.to(roomId).emit('chat_message', {
        from: socket.id,
        message,
        userData
      });
    });

    // Handle room leaving
    socket.on('leave_room', () => {
      console.log(`User ${socket.id} leaving room`);
      
      leaveRoom(socket);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      leaveRoom(socket);
    });
  });

  // Helper function
  async function leaveRoom(socket: CustomSocket):  Promise<void> {
    const roomId = socket.roomId;
    const room = await Room.findById(roomId)
    if (roomId && room) {
      console.log(`Removing user ${socket.id} from room ${roomId}`);
      const leavedUserData = room.users.find(user => user.socketId == socket.id);

      room.users = room.users.filter(user => user.socketId !== socket.id);
      await room.save()
      io.to(roomId).emit('chat_message', {
        from: 'system',
        message: `User ${leavedUserData?.name} left the room`,
      });

      io.to(roomId).emit('user_left', socket.id,leavedUserData?.name);

      io.to(roomId).emit('users_in_room', room.users);

      console.log(`Room ${roomId} users after leave: ${room.users}`);
      
      // Delay room deletion by 1 minute if empty
    if (room.users.length === 0) {
      console.log(`Room ${roomId} is empty, scheduling deletion in 1 minute`);
      setTimeout(async() => {
        if (room && room.users.length === 0) {
          console.log(`Deleting room ${roomId} after 1 minute of inactivity`);
          await Room.findByIdAndDelete(roomId)
        } else {
          console.log(`Room ${roomId} is no longer empty, not deleting`);
        }
      }, 60_000); // 1 minute = 60000 ms
    }

      socket.leave(roomId);
      socket.roomId = null;
    }
  }

  return io;
};
