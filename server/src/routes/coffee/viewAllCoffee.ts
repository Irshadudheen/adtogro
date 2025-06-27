import { Router } from "express";
import { Coffee } from "../../models/coffee";

const router = Router()
router.get('/api/coffee/viewAllCoffee', async (req,res)=>{
    const coffee = await Coffee.find({status:'completed'}).sort({amount:-1,createAt:-1}).populate('userId', 'name email profileImage')
    res.status(200).json(coffee)
})
export { router as viewAllCoffeeRouter }