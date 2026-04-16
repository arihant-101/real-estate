import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import propertiesRoutes from "./routes/properties.js";
import areasRoutes from "./routes/areas.js";
import enquiriesRoutes from "./routes/enquiries.js";
import maintenanceRequestsRoutes from "./routes/maintenance-requests.js";
import blogRoutes from "./routes/blog.js";
import testimonialsRoutes from "./routes/testimonials.js";
import usersRoutes from "./routes/users.js";
import landlordRoutes from "./routes/landlord.js";
import tenantRoutes from "./routes/tenant.js";
import tenanciesRoutes from "./routes/tenancies.js";
import adminRoutes from "./routes/admin.js";

const app = express();
const PORT = env.PORT || 4000;

const explicitOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean)
  : [];
const defaultOrigins = [
  "http://localhost:3000",
  "https://realestate-frontend-h4u3.onrender.com",
];
const allowedOrigins = explicitOrigins.length ? explicitOrigins : defaultOrigins;
const isLocalhost = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin) || isLocalhost(origin)) return cb(null, true);
    cb(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: "12mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: "Too many attempts. Please try again later.", code: "RATE_LIMIT" },
});
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/areas", areasRoutes);
app.use("/api/enquiries", enquiriesRoutes);
app.use("/api/maintenance-requests", maintenanceRequestsRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/landlord", landlordRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/tenancies", tenanciesRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "Not found", code: "NOT_FOUND" });
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
