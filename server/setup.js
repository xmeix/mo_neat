import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./src/apis/auth/auth.route.js";
import orderRoutes from "./src/apis/order/order.route.js";
import productRoutes from "./src/apis/product/product.route.js";
import couponRoutes from "./src/apis/coupon/coupon.route.js";
import batchRoutes from "./src/apis/batch/batch.route.js";
import shippingZoneRoutes from "./src/apis/shippingZone/shippingZone.route.js";
import errorHandler from "./src/middlewares/errorHandler.js";

export const setupRoutes = (app) => {
  // ____________________________________________________________________________
  // Enable CORS for API calls
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://172.27.0.1:5173"],
      credentials: true,
      methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    })
  );

  // ____________________________________________________ ________________________

  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ limit: "30mb", extended: true }));
  app.use(cookieParser());

  app.use("/public", express.static("public"));
  app.use("/api/auth", authRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/coupons", couponRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/batch", batchRoutes);
  app.use("/api/shippingZone", shippingZoneRoutes);
  app.use(errorHandler);
};
