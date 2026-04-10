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
// Better Origin Normalization
const rawAllowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
];

// Clean the origins (remove trailing slashes and nulls)
const allowedOrigins = rawAllowedOrigins
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ""));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server or tools like Postman (where origin is undefined)
    if (!origin) return callback(null, true);

    // Clean the incoming origin for comparison
    const cleanOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(cleanOrigin)) {
      callback(null, true);
    } else {
      console.error(`[CORS Error]: Origin ${origin} not allowed`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
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
