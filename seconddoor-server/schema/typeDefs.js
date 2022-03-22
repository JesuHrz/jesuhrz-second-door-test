import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  enum TaskStatus {
    NOT_STARTED
    IN_PROGRESS
    COMPLETED
  }

  input TaskInput {
    title: String
    description: String
    status: String
  }

  input TaskCreatingInput {
    title: String!
    description: String!
  }

  type Task {
    id: ID!
    createdAt: String!
    title: String!
    description: String
    status: TaskStatus!
    userId: ID!
  }

  type AllTasks {
    notStarted: [Task]
    inProgress: [Task]
    completed: [Task]
  }

  type User {
    id: ID!
    name: String!
    lastName: String!
    email: String!
    tasks: [Task]
    createdAt: String!
  }

  type Auth {
    jwt: String!
    user: User!
  }

  type Query {
    getTaskById(
      id: ID!
    ): Task! 

    getTasksByUserId: AllTasks!
  }

  type Mutation {
    auth(
      email: String!
      password: String!
    ): Auth!

    createUser(
      name: String!
      lastName: String!
      email: String!
      password: String!
    ): Auth!

    createTask(
      input: TaskCreatingInput!
    ): Task!

    updateTask(
      id: ID!
      input: TaskInput!
    ): Task!

    removeTask(
      id: ID!
    ): Task!
  }
`
