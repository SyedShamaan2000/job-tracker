import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import connectDB from './config/db.js'

const app = express()

// Connect to Database
connectDB()

// Middleware
app.use(helmet()) // Security headers
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json()) // Body parser
app.use(morgan('dev')) // Logging

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

export default app