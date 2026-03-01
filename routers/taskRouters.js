import express from "express";
import {
  index,
  store,
  destroy,
  modify,
} from "../controllers/taskController.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();

router.get("/", authenticate, index);
router.post("/", authenticate, store);
router.patch("/:id", authenticate, modify);
router.delete("/:id", authenticate, destroy);

export default router;
