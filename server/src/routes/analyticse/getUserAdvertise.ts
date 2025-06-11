import { Router } from "express";
import { currentUser } from "../../middlewares/current-user";
import { Advertise } from "../../models/advertise";

const router = Router();
router.get('/api/analytics/advertisments',currentUser, async (req ,res)=>{
    console.log('get user advertise list')
    const userId = req.currentUser?.id;
    console.log(userId)
    const advertise = await Advertise.find({userId}).sort({createdAt: -1});
    res.json(advertise)


})
export {router as getUserAdvertiseRouter}