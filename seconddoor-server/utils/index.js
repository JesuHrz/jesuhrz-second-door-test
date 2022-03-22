import bcrypt from 'bcrypt'
import pino from 'pino'
import jwt from 'jsonwebtoken'

import config from '../config/index.js'

export const logger = pino({
  prettyPrint: {
    translateTime: 'SYS:standard'
  }
})

export const generateToken = data => {
  return jwt.sign(data, config.auth.secret)
}

export const comparePassword = (pass, hash) => {
  return bcrypt.compare(pass, hash)
}
