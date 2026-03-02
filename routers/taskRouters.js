import express from "express";
import {
  index,
  store,
  destroy,
  modify,
} from "../controllers/taskController.js";
import authenticate from "../middlewares/authenticate.js";
import taskValidator from "../middlewares/taskValidator.js";
const router = express.Router();

router.get("/", authenticate, index);
router.post("/", authenticate, taskValidator, store);
router.patch("/:id", authenticate, taskValidator, modify);
router.delete("/:id", authenticate, destroy);

export default router;
