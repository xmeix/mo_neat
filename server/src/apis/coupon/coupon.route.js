import express from "express";
import { verifyCookieTokenAndAdmin } from "../../middlewares/auth.middleware.js";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
} from "./coupon.controller.js";

const router = express.Router();

// Admin Routes
router.get("/", verifyCookieTokenAndAdmin, getAllCoupons);
router.post("/", verifyCookieTokenAndAdmin, createCoupon);
router.delete("/:id", verifyCookieTokenAndAdmin, deleteCoupon);

export default router;
