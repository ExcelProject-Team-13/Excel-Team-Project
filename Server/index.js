import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.config.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const PORT = process.env.PORT || 5000
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json())

connectDB()

// Routes
app.use("/api/v1/auth", authRoutes)

connectDB()
.then(app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
}))
.catch((error) => {
  console.error('Database connection failed:', error.message);
});