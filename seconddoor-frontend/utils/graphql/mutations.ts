import { gql } from '@apollo/client'

export const SIGN_IN = gql`
  mutation auth($email: String!, $password: String!) {
    auth(email: $email, password: $password) {
      jwt
      user {
        id
        name
        lastName
        createdAt
      }
    }
  }
`

export const SIGN_UP = gql`
  mutation createUser($name: String!, $lastName: String!, $email: String!, $password: String!) {
    createUser(name: $name, lastName: $lastName, email: $email, password: $password) {
      jwt
      user {
        id
        name
        lastName
        email
      }
    }
  }
`

export const CREATE_TASK = gql`
  mutation createTask($input: TaskCreatingInput!) {
    createTask(input: $input) {
      id
      createdAt
      title
      description
      status
      userId
    }
  }
`

export const UPDATE_TASK = gql`
  mutation updateTask ($id: ID!, $input: TaskInput!) {
    updateTask (id: $id, input: $input) {
      id
      title
      description
      status
      createdAt
    }
  }
`

export const DELETE_TASK = gql`
  mutation removeTaskById ($id: ID!) {
    removeTask (id: $id) {
      id
      title
      description
      status
      createdAt
    }
  }
`