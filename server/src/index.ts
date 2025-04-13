

import 'dotenv/config'
import {app} from './app'
import connectDB from './config/mongodb'
import sendMail from './service/mail'
import { startAdExpiryReminder } from './jobs/adExpiryNotifier.job'
const port = 3000
// sendMail({to:'i.rshadudheen.p10@gmail.com',type:"AD_EXPIRING_SOON",data:{amount:'4000.00 INR',name:'rshad',plan:'premium',adTitle:'my ad title',expiresAt:'2023-10-30T12:00:00Z',renewLink:'http://localhost:3000/renew'}})
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
    // if(!process.env.REDISPORT){
    //     throw new Error('redis port not found')
    // }
    try {
        connectDB()
        startAdExpiryReminder()
    } catch (error) {
        console.error(error)
    }
    finally{

        app.listen(port,()=>console.log('the server is running on 3000!!!'))
    }
}
start()