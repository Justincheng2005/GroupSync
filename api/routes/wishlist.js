import express from "express";
import { getWishlist, addWishlist, deleteWishlist } from "../controllers/wishlist.js";

const router = express.Router();

router.get("/", getWishlist);
router.post("/", addWishlist);
router.delete("/:id", deleteWishlist);

export default router;
