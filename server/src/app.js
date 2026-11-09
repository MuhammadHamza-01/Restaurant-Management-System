import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import kitchenRoutes from "./routes/kitchenRoutes.js";
import posRoutes from "./routes/posRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import menuItemRoutes from "./routes/menuItemRoutes.js";
import tableRoutes from "./routes/tableRoutes.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/kitchen", kitchenRoutes);
app.use("/api/v1/pos", posRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/menu-items", menuItemRoutes);
app.use("/api/v1/tables", tableRoutes);


export default app;
