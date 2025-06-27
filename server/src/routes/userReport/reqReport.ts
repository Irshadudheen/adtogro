import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { currentUser } from "../../middlewares/current-user";
import { ReportUser } from "../../models/report";
import { User } from "../../models/user";

const router = Router();
router.post('/api/report/user/:id',[param('id').trim().notEmpty().isMongoId().withMessage('Required ID'),body('message').trim().notEmpty().withMessage('Resson is required')],
validateRequest,currentUser,async(req:Request,res:Response)=>{
    const {id}= req.params
    const {message}= req.body
    const userId = req.currentUser?.id
    const countofReport = await ReportUser.find({reportId:id}).countDocuments()
    if(countofReport>9){
        const user = await User.findByIdAndUpdate(id,{block:true},{new:true})
    }
    const report =await ReportUser.create({userId,reportId:id,message})
    res.json({message:'report created success',report})
})
export {router as ReportUserRouter}