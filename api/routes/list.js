import express from "express";
import { getList, addList, deleteList } from "../controllers/list.js";

const router = express.Router();

router.get("/", getList);
router.post("/", addList);
router.delete("/", deleteList);

export default router;
