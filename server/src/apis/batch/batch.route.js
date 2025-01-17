import express from "express";
import { verifyCookieTokenAndAdmin } from "../../middlewares/auth.middleware.js";
import { createBatchDelivery } from "./batch.controller.js";

const router = express.Router();

router.post("/homedelivery", verifyCookieTokenAndAdmin, createBatchDelivery);

export default router;
