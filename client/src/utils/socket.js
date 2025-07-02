import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
// Use WebSocket transport
  reconnection: true,        // Enable automatic reconnection
  reconnectionAttempts: 5,   // Number of reconnection attempts
  reconnectionDelay: 1000,   // Delay between reconnection attempts
});

export default socket;