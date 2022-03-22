import { user } from './mocks.js'

export const successAuthQuery = {
  query: `mutation auth($email: String!, $password: String!) {
    auth(email: $email, password: $password) {
      jwt
      user {
        id
        name
        lastName
        email
      }
    }
  }`
}

export const failedAuthQuery = {
  query: `mutation auth($email: String!, $password: String!) {
    auth(email: $email, password: $password) {
      jwt
      id
      name
      lastName
      email
    }
  }`,
  variables: {
    email: 'john.dow+12@gmail.com',
    password: 'password12'
  }
}

export const invalidAuthQuery = {
  query: `mutation auth($emaill: String!, $passwordd: String!) {
    auth(email: $email, password: $password) {
      jwt
      id
      name
      lastName
      email
    }
  }`,
  variables: {
    email: 'john.dow+1@gmail.com',
    password: 'password'
  }
}

export const successfulCreatedUser = {
  query: `mutation createUser($name: String!, $lastName: String!, $email: String!, $password: String!) {
    createUser(name: $name, lastName: $lastName, email: $email, password: $password) {
      jwt
      user {
        id
        name
        lastName
        email
      }
    }
  }`
}

export const InvalidCreatedUser = {
  query: `mutation createUser($namme: String!, $lasttName: String!, $emmail: String!, $paspsword: String!) {
    createUser(name: $name, lastName: $lastName, email: $email, password: $password) {
      jwt
      user {
        id
        name
        lastName
        email
      }
    }
  }`,
  variables: user
}

export const successfulCreatedTask = {
  query: `mutation createTask($input: TaskCreatingInput!) {
    createTask(input: $input) {
      id
      createdAt
      title
      description
      status
      userId
    }
  }`
}

export const successfulUpdatedTaskByStatus = {
  query: `mutation updateTaskByStatus ($id: ID!, $input: TaskInput!) {
    updateTask (id: $id, input: $input) {
      id
      title
      description
      status
      createdAt
    }
  }`,
  variables: {
    input: {}
  }
}

export const getTaskById = {
  query: `query getTaskById ($id: ID!) {
    getTaskById (id: $id) {
      id
      title
      description
      status
      createdAt
    }
  }`,
  variables: {}
}

export const getTasksByUserId = {
  query: `query getTasksByUserId {
    getTasksByUserId {
      notStarted {
        id
        title
        description
        status
        createdAt
      }
      inProgress {
        id
        title
        description
        status
        createdAt
      }
      completed {
        id
        title
        description
        status
        createdAt
      }
    }
  }`,
  variables: {}
}

export const removeTaskById = {
  query: `mutation removeTaskById ($id: ID!) {
    removeTask (id: $id) {
      id
      title
      description
      status
      createdAt
    }
  }`,
  variables: {}
}
