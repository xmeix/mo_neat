import express from "express";
import { verifyCookieTokenAndAdmin } from "../../middlewares/auth.middleware.js";
import {
  addCommunesToWilaya,
  createStopDesk,
  createWilaya,
  deleteCommuneFromWilaya,
  deleteStopDesk,
  deleteWilaya,
  getAllStopDesksByWilaya,
  getAllWilayas,
  updateStopDesk,
  updateWilaya,
} from "./other.controller.js";

const router = express.Router();

router.post("/", verifyCookieTokenAndAdmin, createWilaya);

router.get("/", verifyCookieTokenAndAdmin, getAllWilayas);

router.put("/:id", verifyCookieTokenAndAdmin, updateWilaya);

router.delete("/:id", verifyCookieTokenAndAdmin, deleteWilaya);

router.post("/:id/communes", verifyCookieTokenAndAdmin, addCommunesToWilaya);
router.delete(
  "/:id/communes",
  verifyCookieTokenAndAdmin,
  deleteCommuneFromWilaya
);

router.post("/:wilayaId/stopdesks", verifyCookieTokenAndAdmin, createStopDesk);

router.get(
  "/:wilayaId/stopdesks",
  verifyCookieTokenAndAdmin,
  getAllStopDesksByWilaya
);

router.put("/stopdesks/:id", verifyCookieTokenAndAdmin, updateStopDesk);

router.delete("/stopdesks/:id", verifyCookieTokenAndAdmin, deleteStopDesk);
export default router;
