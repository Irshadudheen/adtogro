

import 'dotenv/config'
import {app} from './app'
import connectDB from './config/mongodb'
import { createServer } from "http";
import { startAdExpiryReminder } from './jobs/adExpiryNotifier.job'
import {  initializeSocket } from "./socketJobs/liveUserCount";
import { initializeGroupVideoCallSocket } from './socketJobs/group_video_call';
import { Server } from 'socket.io';
import { sharePlatform } from './jobs/sharePaltform.job';

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', process.env.CLIENT_URL!],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    credentials: true
  }
});
initializeSocket(io);
initializeGroupVideoCallSocket(io);
export {io}

const port = 3000
const start = async()=>{
    if(!process.env.emailId){
        throw new Error('email not found')
    }
    if(!process.env.password){
        throw new Error('password not found')
    }
    if(!process.env.JWT_KEY){
        throw new Error('jwt key not found')
    }
    if(!process.env.MONGODB_URL){
        throw new Error('mongodb url not found')
    }
    if(!process.env.CLIENT_URL){
        throw new Error('client url not found')
    }
    try {
        connectDB()
        startAdExpiryReminder()
        sharePlatform()
    } catch (error) {
        console.error(error)
    }
    finally{

        server.listen(port,()=>console.log('the server is running on 3000!!!'))
    }
}
start()