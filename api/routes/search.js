import express from "express";
import { placeDetails, placeSearch } from "../controllers/search.js"

const router = express.Router();

router.get("/", placeSearch)
router.get("/details",placeDetails)

export default router;