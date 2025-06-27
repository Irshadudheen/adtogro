import { Request, Response, Router } from "express";
import { param } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { trackEvent } from "../../middlewares/analyticsMiddleware";
import { Advertise } from "../../models/advertise";

const router = Router()
router.patch('/api/advertise/impression/:id',
    [param('id').isMongoId().withMessage('Invalid advertisement ID')],
    validateRequest,
    trackEvent('impression'),
     async (req:Request,res:Response)=>{
        const {id} = req.params;
        await Advertise.findByIdAndUpdate(id, {$inc:{impressions:1}}, {new:true});
        res.send({ message: `Impression recorded for advertisement with ID: ${id}` });

})
export { router as updateImpressionRouter }