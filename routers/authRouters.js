import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import userValidation from "../middlewares/userValidation.js";
const router = express.Router();

router.post("/register", userValidation, register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
