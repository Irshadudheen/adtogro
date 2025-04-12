import { Request, Response, Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { body } from "express-validator";

const router = Router();
router.post("/api/user/login",[body("password").trim().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("email").trim().isEmail().withMessage("Email must be valid"),
] ,validateRequest,
    (req:Request, res:Response) => {
  const { email, password } = req.body;
  
  res.status(200).send({ message: "Login successful" });
});