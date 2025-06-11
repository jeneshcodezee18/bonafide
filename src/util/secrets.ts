import logger from './logger'
import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables')
  dotenv.config({ path: '.env' })
} else {
  logger.debug('Using .env.example file to supply config environment variables')
  dotenv.config({ path: '.env.example' }) // you can delete this after you create your own .env file!
}

export const ENVIRONMENT = process.env.NODE_ENVIRONMENT
const prod = ENVIRONMENT === 'production' // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env.SESSION_SECRET
export const BASE_URL = prod ? process.env.BASE_URL : 'http://127.0.0.1:3061/'
export const POSTGRES_URI = prod ? process.env.POSTGRES_URI : process.env.POSTGRES_URI_LOCAL;

if (SESSION_SECRET === undefined) {
  logger.error('No client secret. Set SESSION_SECRET environment variable.')
  process.exit(1)
}
  



