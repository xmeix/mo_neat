import express from "express";
import { verifyCookieTokenAndAdmin } from "../../middlewares/auth.middleware.js";

import {
  createWilaya,
  deleteWilaya,
  getAllWilayas,
  updateWilaya,
} from "./wilaya.controller.js";

const router = express.Router();

router.post("/", verifyCookieTokenAndAdmin, createWilaya);
router.get("/", verifyCookieTokenAndAdmin, getAllWilayas);

router.put("/:id", verifyCookieTokenAndAdmin, updateWilaya);

router.delete("/:id", verifyCookieTokenAndAdmin, deleteWilaya);

export default router;
