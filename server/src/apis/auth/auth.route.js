import express from "express";
import {
  login, 
  logout,
  register,
} from "../auth/auth.controller.js";

const router = express.Router();
//only admin will login

router.post("/register", register); // do not delete you're gonna admin with it using postman
router.post("/login", login);
router.post("/logout", logout);
 

export default router;
