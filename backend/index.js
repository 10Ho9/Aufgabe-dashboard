import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { config } from "./config.js";
import { connectDB } from "./database/database.js";
import salesRouter from "./router/sales.js";

const app = express();
const port = config.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: config.FRONT_URI,
  })
);
app.use(helmet());
app.use(morgan("tiny"));

app.use("/sales", salesRouter);

connectDB()
  .then(() => {
    console.log("Connected DB-Server!");
    app.listen(port, () => {
      console.log(`on port ${port} ${new Date()}`);
    });
  })
  .catch(console.error);
