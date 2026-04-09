// src/config/env.js
const requiredEnvs = ['MONGODB_URI', 'JWT_SECRET', 'PORT', 'NODE_ENV', 'CLIENT_URL']

requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    console.error(`[Config Error]: Missing required environment variable: ${key}`)
    process.exit(1)
  }
})

export default process.env