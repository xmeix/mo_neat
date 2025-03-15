import express from "express";

import {
  createCommune,
  createOrUpdateWilaya,
  deleteCommunes,
  deleteWilaya,
  getAllCommunes,
  getAllWilayas,
  updateCommune,
} from "./geo.controller.js";
import { verifyCookieTokenAndAdmin } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/wilaya/", verifyCookieTokenAndAdmin, createOrUpdateWilaya);
router.get("/wilaya/", verifyCookieTokenAndAdmin, getAllWilayas);

router.delete("/wilaya/", verifyCookieTokenAndAdmin, deleteWilaya);

router.post("/commune/", verifyCookieTokenAndAdmin, createCommune);
router.get("/commune/", verifyCookieTokenAndAdmin, getAllCommunes);

router.patch("/commune/:id", verifyCookieTokenAndAdmin, updateCommune);
router.delete("/commune/:id", verifyCookieTokenAndAdmin, deleteCommunes);

export default router;
