import express from "express";
import { verifyCookieTokenAndAdmin } from "../../middlewares/auth.middleware.js";
import {
  createShippingZone,
  deleteShippingZone,
  getAllShippingZones,
  updateShippingZone,
} from "./shippingZone.controller.js";

const router = express.Router();

router.post("/", verifyCookieTokenAndAdmin, createShippingZone);
router.get("/", verifyCookieTokenAndAdmin, getAllShippingZones);
router.put("/:id", verifyCookieTokenAndAdmin, updateShippingZone);
router.delete("/:id", verifyCookieTokenAndAdmin, deleteShippingZone);

export default router;
