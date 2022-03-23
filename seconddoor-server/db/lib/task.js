export function setupTask (TaskModel, UserModel) {
  async function create ({ userId, title, description }) {
    return TaskModel.create({
      userId,
      title,
      description
    })
  }

  function deleteBy (query) {
    return TaskModel.destroy({
      where: query,
      raw: true
    })
  }

  function findById (id) {
    return TaskModel.findByPk(id)
  }

  function findBy (query) {
    return TaskModel.findOne({
      where: query
    }, {
      raw: true
    })
  }

  function findAllBy (query) {
    return TaskModel.findAll({
      where: query
    }, {
      raw: true
    })
  }

  function update ({ userId, id, ...query }) {
    const cond = {
      where: {
        id,
        userId
      },
      raw: true
    }

    return TaskModel.update(query, cond)
  }

  return {
    create,
    deleteBy,
    findById,
    findAllBy,
    findBy,
    update
  }
}
