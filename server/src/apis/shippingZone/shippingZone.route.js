import express from "express";
import { verifyCookieTokenAndAdmin } from "../../middlewares/auth.middleware.js";
import {
  createShippingZone,
  deleteShippingZone,
  getAllShippingZones,
  updateDeliveryArea,
} from "./shippingZone.controller.js";

const router = express.Router();

router.post("/", verifyCookieTokenAndAdmin, createShippingZone);
router.get("/", verifyCookieTokenAndAdmin, getAllShippingZones);
router.patch("/:id", verifyCookieTokenAndAdmin, updateDeliveryArea);

router.delete("/deleteAll", verifyCookieTokenAndAdmin, deleteShippingZone);

export default router;
