import express from "express";
import { getUserGroups, getGroup, joinGroup, createGroup, deleteGroup} from "../controllers/group.js";

const router = express.Router()

router.get("/", getUserGroups)
router.get("/:id", getGroup)
router.post("/join", joinGroup)
router.post("/create", createGroup)
router.delete("/", deleteGroup)


export default router