import express from "express";
import { index, store, destroy } from "../controllers/taskController.js";

const router = express.Router();

router.get("/", index);
router.post("/", store);
router.delete("/:id", destroy);

export default router;
