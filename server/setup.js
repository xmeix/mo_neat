import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import authRoutes from "./src/apis/auth/auth.route.js";
import orderRoutes from "./src/apis/order/order.route.js";
import productRoutes from "./src/apis/product/product.route.js";
import couponRoutes from "./src/apis/coupon/coupon.route.js";
import errorHandler from "./src/middlewares/ErrorHandler.js";

export const setupRoutes = (app) => {
  // ____________________________________________________________________________
  // Enable CORS for API calls
  app.use(
    cors({
      origin: "http://localhost:5173",  
      credentials: true,
    })
  );

  // ____________________________________________________ ________________________

  app.use(express.json());
  app.use(bodyParser.json({ limit: "30mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
  app.use(cookieParser());

  app.use("/public", express.static("public"));
  app.use("/api/auth", authRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/coupons", couponRoutes);
  app.use("/api/products", productRoutes);
  app.use(errorHandler);
};
