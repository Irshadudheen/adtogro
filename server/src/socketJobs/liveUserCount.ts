import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { SocketNotInitializedError } from '../errors/socket-not-init-error';

let io: Server | null = null;
const timeDurations = [
    { start: 0, end: 4, peak: 0 },  // 12 AM - 4 AM
    { start: 4, end: 8, peak: 0 },  // 4 AM - 8 AM
    { start: 8, end: 12, peak: 0 }, // 8 AM - 12 PM
    { start: 12, end: 16, peak: 0 }, // 12 PM - 4 PM
    { start: 16, end: 20, peak: 0 }, // 4 PM - 8 PM
    { start: 20, end: 24, peak: 0 }, // 8 PM - 12 AM
];


export const initializeSocket = (server: HttpServer): Server => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT'],
        },
    });

    let onlineUsers: number = 0;

    io.on('connection', (socket: Socket) => {
        const peakCounts = getPeakUserCounts();
console.log('Peak user counts for each time duration:', peakCounts);
        onlineUsers++;
        console.log('A user connected:', socket.id);
        io?.emit('userCount', onlineUsers);

        // Listen for the 'getUserCount' event and respond with the current count
        socket.on('getUserCount', (callback) => {
            if (typeof callback === 'function') {
                callback(onlineUsers); // Send the current online user count to the client
            }
        });

        socket.on('disconnect', () => {
            onlineUsers--;
         
            io?.emit('userCount', onlineUsers);
            updatePeakUserCount(onlineUsers);
        });
    });

    return io;
};
const updatePeakUserCount = (currentCount: number) => {
    const currentHour = new Date().getHours();
    const currentDuration = timeDurations.find(
        (duration) => currentHour >= duration.start && currentHour < duration.end
    );

    if (currentDuration) {
        currentDuration.peak = Math.max(currentDuration.peak, currentCount);
    }
};

// Function to get the highest user count for each time duration
export const getPeakUserCounts = (): { start: number; end: number; peak: number }[] => {
    return timeDurations;
};
export const getIO = (): Server => {
    if (!io) {
        throw new SocketNotInitializedError();
    }
    return io;
};