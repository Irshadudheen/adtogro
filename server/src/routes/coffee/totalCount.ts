import { Router } from "express";
import { Coffee } from "../../models/coffee";

const router = Router();
router.get('/api/coffee/totalCount', async (req,res)=>{
    const totalCount = await Coffee.countDocuments();
    res.status(200).json({totalCount});
})
export { router as totalCountCoffeeRouter };