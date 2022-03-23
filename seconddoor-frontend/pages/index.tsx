import type { NextPage } from 'next'
import Head from 'next/head'
import axios from 'axios'
import Board from 'react-trello'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useMutation, useQuery, useApolloClient } from '@apollo/client'
import { useFormik } from 'formik'

import withSession from 'lib/session'
import {
  GET_TASKS,
  READ_TASK,
  READ_TASK_1
 } from 'utils/graphql/queries'
import {
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK
} from 'utils/graphql/mutations'

import Button from 'components/Button'
import Modal from 'components/Modal'
import Wrapper from 'components/Wrapper'
import InputText from 'components/InputText'

import { Header, Title, WrapperActions, LogOut } from './styles'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
const INITIAL_STATE = {
  lanes: [
    {
      id: 'NOT_STARTED',
      title: 'NOT STARTED',
      label: '0',
      cards: []
    },
    {
      id: 'IN_PROGRESS',
      title: 'IN PROGRESS',
      label: '0',
      cards: []
    },
    {
      id: 'COMPLETED',
      title: 'COMPLETED',
      label: '0/0',
      cards: []
    }
  ]
}

const Home: NextPage = ({ jwt }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const apolloClient = useApolloClient()
  const [queryIsReady, setQueryIsReady] = useState(false)
  const [handleEventBus, setHandleEventBus] = useState({})
  const result = useQuery(GET_TASKS, {
    context: { headers: { authorization: `Bearer ${jwt}` } }
  })
  const [handleCreateTask] = useMutation(CREATE_TASK, {
    context: { headers: { authorization: `Bearer ${jwt}` } }
  })
  const [handleUpdateTask] = useMutation(UPDATE_TASK, {
    context: { headers: { authorization: `Bearer ${jwt}` } }
  })
  const [handleRemoveTask] = useMutation(DELETE_TASK, {
    context: { headers: { authorization: `Bearer ${jwt}` } }
  })

  console.log('apolloClient', apolloClient.cache)

  useEffect(() => {
    if (result.data && !queryIsReady && handleEventBus.publish)  {
      result.data.getTasksByUserId.notStarted.forEach(task => {
        handleEventBus.publish({
          type: 'ADD_CARD',
          laneId: 'NOT_STARTED',
          card: task
        })
      })
      result.data.getTasksByUserId.inProgress.forEach(task => {
        handleEventBus.publish({
          type: 'ADD_CARD',
          laneId: 'IN_PROGRESS',
          card: task
        })
      })
      result.data.getTasksByUserId.completed.forEach(task => {
        handleEventBus.publish({
          type: 'ADD_CARD',
          laneId: 'COMPLETED',
          card: task
        })
      })

      setQueryIsReady(true)
    }
  }, [result, handleEventBus, queryIsReady, handleUpdateTask])
  

  const setEventBus = useCallback((eventBus) => {
    setHandleEventBus(eventBus)
  }, [setHandleEventBus])

  const handleAddOrUpdateCard = useCallback(async ({type, laneId, card}) => {
    handleEventBus.publish({ type, laneId, card })
  }, [handleEventBus])

  const { setValues, ...formik } = useFormik({
    initialValues: {
      id: '',
      title: '',
      description: ''
    },
    onSubmit: (values) => {
      handleCreateOrUpdate(values)
    }
  })

  const handleCreateOrUpdate = useCallback(async (values) => {
    try {
      if (values.id) {
        const { data } = await handleUpdateTask({
          variables: {
            id: values.id,
            input: { 
              title: values.title,
              description: values.description
            }
          }
        })

        handleAddOrUpdateCard({
          type: 'UPDATE_CARD',
          laneId: data.updateTask.status,
          card: data.updateTask
        })

        return
      }

      const { data } = await handleCreateTask({
        variables: {
          input: { 
            title: values.title,
            description: values.description
          }
        }
      })

      handleAddOrUpdateCard({
        type: 'ADD_CARD',
        laneId: data.createTask.status,
        card: data.createTask
      })
      formik.resetForm()
    } catch (error) {
      console.log('Error: ', error)
    }
  }, [handleCreateTask, handleUpdateTask, handleAddOrUpdateCard, formik])

  const handleDragEnd = useCallback(async (cardId, _, newStatus) => {
    try {
      await handleUpdateTask({
        variables: {
          id: cardId,
          input: { 
            status: newStatus,
          }
        }
      })

    } catch (error) {
      console.log('Error', error)
    }
  }, [handleUpdateTask])

  const handleDataChange = useCallback((board) => {
    board.lanes.map((lane) => {
      const { cards } = lane
      lane.label = `${cards.length}`

      return lane
    })
  }, [])

  const handleClickCard = useCallback((cardId) => {
    const task = apolloClient.readFragment({
      id: `Task:${cardId}`,
      fragment: READ_TASK,
    })


    const result = apolloClient.readQuery({
      query: READ_TASK_1
    })

    console.log('result', result)

    formik.setFieldValue('id', task.id)
    formik.setFieldValue('title', task.title)
    formik.setFieldValue('description', task.description)
    setIsOpen(true)
  }, [apolloClient, formik])

  const handleRemoveCard = useCallback(async (cardId) => {
    try {
      await handleRemoveTask({
        variables: {
          id: cardId
        }
      })

    } catch (error) {
      console.log('Error', error)
    }
  }, [handleRemoveTask])

  const handleLogOut = useCallback(async () => {
    const API_URL = `${DOMAIN}/api/logout`

    try {
      await axios.post(API_URL)
      router.push('/sign-in')
    } catch (e) {
      console.error('Error:', e)
    }
  }, [router])

  const handleCloseModal = useCallback(() => {
    setIsOpen(false)
    formik.resetForm()
  }, [formik])

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Header>
         <Title>Dashboard</Title>
         <WrapperActions>
           <Button
            value='Create Task'
            secondary
            onClick={() => setIsOpen(true)}
          />

           <LogOut onClick={handleLogOut}>
             LOGOUT
           </LogOut>
        </WrapperActions>
      </Header>
      <Board
        data={INITIAL_STATE}
        style={{backgroundColor: '#2148C0'}}
        laneStyle={{ backgroundColor: '#f4f5f7' }}
        eventBusHandle={setEventBus}
        handleDragEnd={handleDragEnd}
        onDataChange={handleDataChange}
        onCardClick={handleClickCard}
        onCardDelete={handleRemoveCard}
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={handleCloseModal}
      >
        <form className="w100" onSubmit={formik.handleSubmit} autoComplete='off'>
          <Wrapper className='mb-20'>
            <InputText
              name='title'
              placeholder='Title'
              value={formik.values.title}
              onChange={formik.handleChange}
              secondary
            />
          </Wrapper>
          <Wrapper className='mb-20'>
            <InputText
              type='textarea'
              name='description'
              placeholder='Description'
              value={formik.values.description}
              onChange={formik.handleChange}
              secondary
            />
          </Wrapper>
          <Button
            type='submit'
            value={formik.values.id ? 'Update task' : 'Create task'}
            secondary
          />
        </form>
      </Modal>
    </>
  )
}

export default Home

export const getServerSideProps = withSession(({ req, res }) => {
  const token = req.session.get('token')

  if (!token) {
    res.setHeader('location', '/sign-in')
    res.statusCode = 302
    res.end()

    return { props: {} }
  }

  return {
    props: {
      jwt: token
    }
  }
})
