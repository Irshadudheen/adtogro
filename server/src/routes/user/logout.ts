import { Router } from "express";

const router = Router()
router.post('/api/user/logout',async(req,res)=>{
    res.clearCookie('jwt')
    res.status(200).json({message:'Logout success'})
})
export { router as logoutRouter }