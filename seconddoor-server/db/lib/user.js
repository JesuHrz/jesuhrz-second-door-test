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

  function deleteBy (query) {
    return UserModel.destroy({
      where: query,
      raw: true
    })
  }

  return {
    create,
    findBy,
    deleteBy
  }
}
