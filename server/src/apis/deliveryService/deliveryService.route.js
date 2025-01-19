import express from "express";
import { verifyCookieTokenAndAdmin } from "../../middlewares/auth.middleware.js";
import {
  createDeliveryService,
  deleteDeliveryService,
  getAllDeliveryServices,
  updateDeliveryService,
} from "./deliveryService.controller.js";

const router = express.Router();

router.post("/", verifyCookieTokenAndAdmin, createDeliveryService);
router.get("/", verifyCookieTokenAndAdmin, getAllDeliveryServices);

router.patch("/:id", verifyCookieTokenAndAdmin, updateDeliveryService);
router.delete("/deleteAll", verifyCookieTokenAndAdmin, deleteDeliveryService);

export default router;
