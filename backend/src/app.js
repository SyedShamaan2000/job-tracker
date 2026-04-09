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
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://your-frontend-domain.com",
].filter(Boolean); // Remove undefined/null values

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by CORS policy"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// --- API Routes ---
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);

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
