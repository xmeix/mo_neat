import express from "express";
import { verifyCookieTokenAndAdmin } from "../../middlewares/auth.middleware.js";
import {
  changeOrderStatus,
  createOrder,
  getAllOrders,
} from "./order.controller.js";

const router = express.Router();

//PUBLIC ROUTES
router.post("/", createOrder);

//Admin
router.get("/", verifyCookieTokenAndAdmin, getAllOrders);
router.patch(
  "/:id/status/change",
  verifyCookieTokenAndAdmin,
  changeOrderStatus
);

export default router;
