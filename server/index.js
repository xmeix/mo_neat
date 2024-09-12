import express from "express";
import dotenv from "dotenv";
import { setupRoutes } from "./setup.js";

dotenv.config();
const app = express();
setupRoutes(app); 

app.listen(process.env.PORT, () => {
  console.log("Server is running on port" + process.env.PORT);
});
