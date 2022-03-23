import { gql } from '@apollo/client'

export const GET_TASKS = gql`
  query getTasksByUserId {
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
  }
`

export const READ_TASK = gql`
  fragment myTask on Task {
    id
    title
    description
    status
    createdAt
  }
`

export const READ_TASK_1 = gql`
  query ReadTask {
    task(id: 101) {
      id
      title
      description
      status
      createdAt
    }
  }
`