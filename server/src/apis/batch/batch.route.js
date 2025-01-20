import express from "express";
import { verifyCookieTokenAndAdmin } from "../../middlewares/auth.middleware.js";
import { createSzsBatch } from "./batch.controller.js";

const router = express.Router();

router.post("/szs", verifyCookieTokenAndAdmin, createSzsBatch);

export default router;
