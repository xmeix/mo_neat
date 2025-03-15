import express from "express";
import { verifyCookieTokenAndAdmin } from "../../middlewares/auth.middleware.js";
import {
  createOrUpdateRelay,
  createOrUpdateZone,
  deleteAllRelayPoints,
  deleteAllZones,
  getAllRelayPoints,
  getAllZones,
} from "./zone.controller.js";
const router = express.Router();

router.patch("/zone/", verifyCookieTokenAndAdmin, createOrUpdateZone);
router.get("/zone/", verifyCookieTokenAndAdmin, getAllZones);
router.delete("/zone/deleteAll", verifyCookieTokenAndAdmin, deleteAllZones);

router.patch("/relay/", verifyCookieTokenAndAdmin, createOrUpdateRelay);
router.get("/relay/", verifyCookieTokenAndAdmin, getAllRelayPoints);
router.delete(
  "/relay/deleteAll",
  verifyCookieTokenAndAdmin,
  deleteAllRelayPoints
);

export default router;
