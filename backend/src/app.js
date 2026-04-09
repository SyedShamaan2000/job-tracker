import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import connectDB from './config/db.js'

import userRoutes from './routes/userRoutes.js'
import jobRoutes from './routes/jobRoutes.js'

const app = express()

connectDB()

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// Routes
app.use('/api/users', userRoutes)
app.use('/api/jobs', jobRoutes)

// Custom 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` })
})

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))