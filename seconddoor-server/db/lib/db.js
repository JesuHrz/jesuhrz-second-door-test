import pg from 'pg'
import Sequelize from 'sequelize'

pg.types.setTypeParser(1114, stringValue => {
  return new Date(stringValue + '+0000')
})

let sequelize = null

export default function setupDatabase (config) {
  if (!sequelize) {
    const { database, username, password, ...restConfig } = config
    sequelize = new Sequelize(database, username, password, {
      define: {
        charset: 'utf8',
        dialectOptions: {
          collate: 'utf8_general_ci'
        }
      },
      ...restConfig
    })
  }

  return sequelize
}
