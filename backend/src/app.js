import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

// Initialize Database
connectDB();

const app = express();

// --- Standard Middleware ---
app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- Security: CORS Configuration ---
// Strict CORS for production
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://your-frontend-domain.com",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// --- API Routes ---
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
// Add this above your other routes in app.js
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Job Tracker API is live.",
    version: "1.0.0",
    docs: "https://github.com/SyedShamaan2000/job-tracker"
  })
})

// --- Fallback Handlers ---

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.originalUrl}`,
  });
});

// Global Error Boundary
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  const response = {
    success: false,
    message: err.message || "Internal Server Error",
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

