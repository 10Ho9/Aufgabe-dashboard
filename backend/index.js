import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    //origin: "*",
    origin: process.env.FRONT_URI,
  })
);

const dbURI = process.env.MONGODB_URI;

mongoose
  .connect(dbURI, {})
  .then(() => {
    console.log("MongoDB conneted!");
  })
  .catch((err) => {
    console.error("MongoDB failed", err);
  });

app.get("/api/db-check", (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ message: "MongoDB 데이터베이스 연결 정상" });
  } else {
    res.status(500).json({ message: "MongoDB 데이터베이스 연결 실패" });
  }
});

app.get("/api/backend-check", (req, res) => {
  res.status(200).json({ message: "백엔드 연결 정상" });
});

app.get("/", (req, res) => {
  res.send("Hello, Express");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
