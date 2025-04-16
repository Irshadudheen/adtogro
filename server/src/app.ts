import express,{json, urlencoded} from 'express'
import 'express-async-errors'
// import { currentUserRouter,singoutRouter ,googleAuthRouter,createQrRouter,createUrlRouter,redirectUrlRouter,getURLAnalyticsRouter, getOverallAnalyticsRouter, topicAnalyticsRouter} from './routes/index'
import { createAdvertiseRouter } from './routes/advertise/createAdvertise'
import { errorhandler } from './middlewares/error-handler'
import cors from 'cors'
import { NotFoundError } from './errors/not-found-error'
import { signUpRouter } from './routes/user/signUp'
import { loginRouter } from './routes/user/login'
import { logoutRouter } from './routes/user/logout'
import { updateClicksRouter } from './routes/advertise/updateClicks'
import { getAdvertiseRouter } from './routes/advertise/getAdvertise'
import { updateAdvertiseRouter } from './routes/advertise/updateAdvertise'
import { verifyEmailRouter } from './routes/user/verify-email'


const app = express()


app.use(json())
app.use(urlencoded({extended:true}))
//cookie parser
//cors
app.use(cors())
//routes
app.use(signUpRouter)
app.use(verifyEmailRouter)
app.use(loginRouter)
app.use(logoutRouter)
app.use(createAdvertiseRouter)
app.use(updateClicksRouter)
app.use(getAdvertiseRouter)
app.use(updateAdvertiseRouter)
//not found route
app.all('*',async()=>{
    throw new NotFoundError();
})
//error handler
app.use(errorhandler as express.ErrorRequestHandler)
export {app}