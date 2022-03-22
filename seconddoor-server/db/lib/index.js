
import bcrypt from 'bcrypt'
import setupDatabase from './db.js'

export { setupUser } from './user.js'
export { setupTask } from './task.js'

const saltRounds = 5

export function hashPassword (pass) {
  return bcrypt.hash(pass, saltRounds)
}

export function comparePassword (pass, hash) {
  return bcrypt.compare(pass, hash)
}

export default setupDatabase
