import express from "express";
import {
  registerUser,
  loginUser,
  Google,
  signout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", Google);
router.post("/signout", signout);
export default router;
