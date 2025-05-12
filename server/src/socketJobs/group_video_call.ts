import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { SocketNotInitializedError } from '../errors/socket-not-init-error';
import { rooms } from '../RoomData/roomData';

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
    socket.on('join_room', (roomId: string,userName:string) => {
      console.log(userName)
      console.log(`User ${socket.id} attempting to join room: ${roomId}`);

      if (!rooms[roomId]) {
        // rooms[roomId] = { users: [], userName:[userName]  };
        // console.log(`Room ${roomId} created`);
        socket.emit('room_not_found');
        return;
      }

      if (rooms[roomId].users.length >= MAX_USERS_PER_ROOM) {
        console.log(`Room ${roomId} is full`);
        socket.emit('room_full');
        return;
      }

      if (rooms[roomId].users.includes(socket.id)) {
        console.log(`User ${socket.id} is already in room ${roomId}`);
        return;
      }

      socket.join(roomId);
      rooms[roomId].users.push(socket.id);

      socket.roomId = roomId;

      console.log(`User ${socket.id} joined room ${roomId}`);
      console.log(`Room ${roomId} users: ${rooms[roomId].users}`);

      // Notify users
      io.to(roomId).emit('users_in_room', rooms[roomId].users);

      socket.to(roomId).emit('chat_message', {
        from: 'system',
        message: `User ${socket.id.substring(0, 5)} joined the room`,
      });

      // Send recent messages
      if (rooms[roomId].messages && rooms[roomId].messages.length > 0) {
        socket.emit('chat_history', rooms[roomId].messages);
      }

      // Request offers from existing users
      const usersInRoom = rooms[roomId].users.filter(id => id !== socket.id);
      usersInRoom.forEach(userId => {
        console.log(`Requesting offer from ${userId} to ${socket.id}`);
        io.to(userId).emit('offer_request', { from: socket.id });
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
    socket.on('chat_message', ({ roomId, message }: { roomId: string; message: string }) => {
      if (!roomId || !rooms[roomId]) return;

      console.log(`Chat message from ${socket.id} in room ${roomId}: ${message}`);

      const formattedMessage = {
        from: socket.id,
        message,
        time: new Date().toISOString(),
      };

      if (!rooms[roomId].messages) {
        rooms[roomId].messages = [];
      }

      rooms[roomId].messages.push(formattedMessage);

      if (rooms[roomId].messages.length > 50) {
        rooms[roomId].messages.shift();
      }

      socket.to(roomId).emit('chat_message', {
        from: socket.id,
        message,
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
  function leaveRoom(socket: CustomSocket): void {
    const roomId = socket.roomId;

    if (roomId && rooms[roomId]) {
      console.log(`Removing user ${socket.id} from room ${roomId}`);

      rooms[roomId].users = rooms[roomId].users.filter(id => id !== socket.id);

      io.to(roomId).emit('chat_message', {
        from: 'system',
        message: `User ${socket.id.substring(0, 5)} left the room`,
      });

      io.to(roomId).emit('user_left', socket.id);

      io.to(roomId).emit('users_in_room', rooms[roomId].users);

      console.log(`Room ${roomId} users after leave: ${rooms[roomId].users}`);

      if (rooms[roomId].users.length === 0) {
        console.log(`Removing empty room ${roomId}`);
        delete rooms[roomId];
      }

      socket.leave(roomId);
      socket.roomId = null;
    }
  }

  return io;
};
