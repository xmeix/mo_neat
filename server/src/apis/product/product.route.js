import express from "express";
import { verifyCookieTokenAndAdmin } from "../../middlewares/auth.middleware.js";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
} from "./product.controller.js";
import { upload } from "../../utils/uploadVars.js";

const router = express.Router();

// Public Routes
router.get("/", getAllProducts);

// Admin Routes
router.post("/", verifyCookieTokenAndAdmin, upload.any("image"), addProduct);
router.patch("/:id", verifyCookieTokenAndAdmin, editProduct);
router.delete("/:id", verifyCookieTokenAndAdmin, deleteProduct);

export default router;
