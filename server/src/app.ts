import express,{Errback, json, NextFunction, Request, Response, urlencoded} from 'express'
import 'express-async-errors'
import helmet from "helmet";



import { createAdvertiseRouter } from './routes/advertise/createAdvertise'
import { errorhandler } from './middlewares/error-handler'
import cors from 'cors'
import { NotFoundError } from './errors/not-found-error'

import { logoutRouter } from './routes/user/logout'
import { updateClicksRouter } from './routes/advertise/updateClicks'
import { getAdvertiseRouter } from './routes/advertise/getAdvertise'
import { updateAdvertiseRouter } from './routes/advertise/updateAdvertise'
import { verifyEmailRouter } from './routes/user/verify-email'
import { createOrderRouter } from './routes/order/createOrder'
// import { forgotPasswordRouter } from './routes/user/forgotPassword'
// import { newPasswordRouter } from './routes/user/newPassword'
import { createRoomRouter } from './routes/room/createRoom'
import { getRoomDetailsRouter } from './routes/room/getRoomDetails'
import { getAllRoomDetailsRouter } from './routes/room/getAllRoomDetails'
import { communityCountRouter } from './routes/user/communityCount'
import { googleAuthRouter } from './routes/user/googleLogin'
import { AnalyticsStatusRouter } from './routes/analyticse/viewAnalytise';
import { updateImpressionRouter } from './routes/advertise/updateImpression';
import { roomCountRouter } from './routes/room/roomCount';
import { totalCountCoffeeRouter } from './routes/coffee/totalCount';
import { viewAllCoffeeRouter } from './routes/coffee/viewAllCoffee';
import { buyCoffeeRouter } from './routes/coffee/buyCoffee';
import { getLatestPerformanceRouter } from './routes/analyticse/getLatestPerformance';
import { uploadImageRouter } from './routes/uploadImage/uploadImage';
import { getUserAdvertiseRouter } from './routes/analyticse/getUserAdvertise';
import { RenewAdRouter } from './routes/order/reniewOrder';
import { renewAdUpdateRouter } from './routes/advertise/renewAdvertise';
import { logRequest } from './middlewares/loggerMiddleware';
import { orderCoffeeRouter } from './routes/order/orderCoffee';
import { ReportUserRouter } from './routes/userReport/reqReport';


const app = express()

// log request
// app.use(logRequest)


//  app.use(morgan('combined'));
app.use(helmet())

app.use(json())
app.use(urlencoded({extended:true}))
//cookie parser
//cors
const CLIENT_URL = 'http://localhost:5173'
app.use(cors({
   origin: CLIENT_URL,
   
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  
  credentials: true,
}
 
))

//routes
// app.use(signUpRouter)
app.use(verifyEmailRouter)
// app.use(loginRouter)
app.use(orderCoffeeRouter)
app.use(logoutRouter)
app.use(createAdvertiseRouter)
app.use(updateClicksRouter)
app.use(getAdvertiseRouter)
app.use(updateAdvertiseRouter)
app.use(createOrderRouter)
app.use(googleAuthRouter)
// app.use(forgotPasswordRouter)
// app.use(newPasswordRouter)
app.use(createRoomRouter)
app.use(getRoomDetailsRouter)
app.use(getAllRoomDetailsRouter)
app.use(communityCountRouter)
app.use(AnalyticsStatusRouter)
app.use(updateImpressionRouter)
//count of room
app.use(roomCountRouter)
//count of coffee
app.use(totalCountCoffeeRouter)
//view all coffee
app.use(viewAllCoffeeRouter)
// buy coffee
app.use(buyCoffeeRouter)
//view latest performance of ad
app.use(getLatestPerformanceRouter)
//upload image
app.use(uploadImageRouter)
//user analytics
app.use(getUserAdvertiseRouter)
//renew ad route
app.use(RenewAdRouter)
//renew ad update route
app.use(renewAdUpdateRouter)
//report user 
app.use(ReportUserRouter)
//not found route
app.all('*',async()=>{
    throw new NotFoundError();
})
//error handler
app.use(errorhandler as express.ErrorRequestHandler)
export {app}