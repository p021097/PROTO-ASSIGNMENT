import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import uploadedFileRouter from "./routes/uploadedFileRoute.js";

dotenv.config();

// App config

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

app.get("/", (req, res) => {
  res.send("API working");
});

app.use("/api/files", uploadedFileRouter);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
