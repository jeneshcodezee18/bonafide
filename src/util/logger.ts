import winston from 'winston'
import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' })
} else {
  dotenv.config({ path: '.env.example' })
}

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENVIRONMENT === 'production' ? 'error' : 'debug'
    }),
    new winston.transports.File({ filename: 'debug.log', level: 'debug' })
  ]
}

const logger = winston.createLogger(options)

if (process.env.NODE_ENVIRONMENT !== 'production') {
  logger.debug('Logging initialized at debug level')
}

export default logger
