import { Router } from "express";
import { Advertise } from "../../models/advertise";
import { BadRequestError } from "../../errors/bad-request-error";
import { trackEvent } from "../../middlewares/analyticsMiddleware";
import { currentUser } from "../../middlewares/current-user";

const router = Router();
router.get(
  "/api/advertise/:id",
  currentUser,
  trackEvent("click"), // Middleware injected here
  async (req, res) => {
    const advertise = await Advertise.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true }
    );
    res.send({ advertise });
  }
);
export { router as updateClicksRouter }