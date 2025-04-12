import express,{json, urlencoded} from 'express'
import 'express-async-errors'
// import { currentUserRouter,singoutRouter ,googleAuthRouter,createQrRouter,createUrlRouter,redirectUrlRouter,getURLAnalyticsRouter, getOverallAnalyticsRouter, topicAnalyticsRouter} from './routes/index'
import { createAdvertiseRouter } from './routes/advertise/createAdvertise'
import { errorhandler } from './middlewares/error-handler'
import cors from 'cors'
import { NotFoundError } from './errors/not-found-error'
import { signUpRouter } from './routes/user/signUp'


const app = express()


app.use(json())
app.use(urlencoded({extended:true}))
//cookie parser
//cors
app.use(cors())
//routes
app.use(signUpRouter)
app.use(createAdvertiseRouter)
// app.use(googleAuthRouter)
// app.use(currentUserRouter)
// app.use(singoutRouter)
// app.use(createUrlRouter)
// app.use(redirectUrlRouter)
// app.use(getURLAnalyticsRouter)
// app.use(getOverallAnalyticsRouter)
// app.use(topicAnalyticsRouter)
// app.use(createQrRouter)
//not found route
app.all('*',async()=>{
    throw new NotFoundError();
})
//error handler
app.use(errorhandler as express.ErrorRequestHandler)
export {app}