import { Router } from "express";
import { User } from "../../models/user";

const router = Router();
router.get('/api/community/count', async(req,res)=>{
    const communityCount =await User.countDocuments()
   
    res.status(200).send({communityCount})
})
export {router as communityCountRouter} 