export function setupUser (UserModel) {
  function create ({ name, lastName, email, password }) {
    return UserModel.create({
      name,
      lastName,
      email,
      password
    }, {
      raw: true
    })
  }

  function findBy (query) {
    return UserModel.findOne({
      attributes: [
        'id',
        'name',
        'lastName',
        'email',
        'password',
        'createdAt'
      ],
      where: query,
      raw: true
    })
  }

  function findById (id) {
    return UserModel.findByPk(id)
  }

  function update ({ id, ...query }) {
    const cond = {
      where: {
        id
      },
      individualHooks: true,
      raw: true
    }

    return UserModel.update(query, cond)
  }

  function deleteBy (query) {
    return UserModel.destroy({
      where: query,
      raw: true
    })
  }

  return {
    create,
    findBy,
    findById,
    update,
    deleteBy
  }
}
