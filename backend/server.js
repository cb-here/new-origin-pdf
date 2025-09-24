import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pdfRoutes from "./routes/pdfRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import dotenv from "dotenv"
import { connectDB } from "./db/database.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json());

app.use("/api/pdf", pdfRoutes);
app.use("/api", userRoutes)

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
