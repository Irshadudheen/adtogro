import { Request, Response, Router } from "express";
import { Advertise } from "../../models/advertise";
import { BadRequestError } from "../../errors/bad-request-error";
import { trackEvent } from "../../middlewares/analyticsMiddleware";
import { currentUser } from "../../middlewares/current-user";
import { param } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();
router.get(
  "/api/advertise/:id",
  [param("id").isMongoId().withMessage("Invalid ID format")],
  validateRequest,
  trackEvent("click"), // Middleware injected here
  async (req:Request, res:Response) => {
    const advertise = await Advertise.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true }
    );
    
    res.send({ advertise });
  }
);
export { router as updateClicksRouter }