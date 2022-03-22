import 'dotenv/config'

import { logger } from '../utils/index.js'

export default {
  db: {
    database: process.env.DB_NAME || 'seconddoor',
    username: process.env.DB_USER || 'koombea',
    password: process.env.DB_PASS || '',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => process.env.NODE_ENV !== 'test' ? logger.info(s) : null,
    setup: false
  },
  auth: {
    secret: process.env.JWT_SECRET || 'seconddoor@koombea',
    algorithms: ['HS256']
  }
}
