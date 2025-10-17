import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import invoiceRoute from "./routes/invoiceRoutes.js";
import authRoute from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";


const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true, 
  })
);

app.use(express.json());

const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 60 });
app.use(limiter);

app.use("/api/invoices", invoiceRoute);
app.use("/api/auth", authRoute);

export default app;
