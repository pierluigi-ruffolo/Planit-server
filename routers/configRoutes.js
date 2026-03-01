import express from "express";
import { configController } from "../controllers/configController.js";
const router = express.Router();

router.get("/", configController);

export default router;
