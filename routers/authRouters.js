import express from "express";
import {
  register,
  login,
  logout,
  checkAuth,
} from "../controllers/authController.js";
import userValidation from "../middlewares/userValidation.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();

router.post("/register", userValidation, register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, checkAuth);

export default router;
