import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import propertiesRoutes from "./routes/properties.js";
import areasRoutes from "./routes/areas.js";
import enquiriesRoutes from "./routes/enquiries.js";
import maintenanceRequestsRoutes from "./routes/maintenance-requests.js";
import blogRoutes from "./routes/blog.js";
import testimonialsRoutes from "./routes/testimonials.js";
import usersRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/areas", areasRoutes);
app.use("/api/enquiries", enquiriesRoutes);
app.use("/api/maintenance-requests", maintenanceRequestsRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/users", usersRoutes);

app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "Not found", code: "NOT_FOUND" });
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
