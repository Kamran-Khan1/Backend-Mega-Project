import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
const router = Router();

router.route("/register").post(registerUser);

export default router;

// http://localhost:8000/api/v1/users/register => POST request
