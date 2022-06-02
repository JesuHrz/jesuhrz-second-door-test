import type { NextPage } from 'next'
import Head from 'next/head'
import { useMutation } from '@apollo/client'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import axios from 'axios'
import withSession from 'lib/session'

import Background from 'components/Background'
import {
  Container,
  Content,
  Title
} from '../sign-in/styles'
import InputText from 'components/InputText'
import Button from 'components/Button'
import Wrapper from 'components/Wrapper'
import Link from 'components/Link'

import { SIGN_UP } from 'utils/graphql/mutations'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
const API_URL = `${DOMAIN}/api/auth`

const SignUp: NextPage = () => {
  const router = useRouter()
  const [handleSignUp, { loading, error }] = useMutation(SIGN_UP)

  const { setValues, ...formik } = useFormik({
    initialValues: {
      name: '',
      lastName: '',
      email: '',
      password: ''
    },
    onSubmit: async values => {
      try {
        const { data } = await handleSignUp({
          variables: {
            name: values.name,
            lastName: values.lastName,
            email: values.email,
            password: values.password
          }
        })

        await axios.post(API_URL, { jwt: data.createUser.jwt })

        router.push('/')
      } catch (error) {
        console.log('Error', error)
      }
    }
  })

  return (
    <Container>
      <Head>
        <title>Sign Up</title>
      </Head>
      <Background
        src='/images/sign-in.png'
        alt='Sign in background'
      />
      <Content>
        <Title>Sign Up</Title>
        <form className="w100" onSubmit={formik.handleSubmit} autoComplete='off'>
          <Wrapper className='mb-20'>
            <InputText
              name='name'
              placeholder='name'
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </Wrapper>
          <Wrapper className='mb-20'>
            <InputText
              name='lastName'
              placeholder='Last name'
              value={formik.values.lastName}
              onChange={formik.handleChange}
            />
          </Wrapper>
          <Wrapper className='mb-20'>
            <InputText
              name='email'
              placeholder='Email'
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </Wrapper>
          <Wrapper className='mb-20'>
            <InputText
              name='password'
              placeholder='Password'
              type='password'
              value={formik.values.password}
              onChange={formik.handleChange}
            />
          </Wrapper>
          <Wrapper className='mt-20 mb-5'>
            <Button type='submit' value='Create Account' disabled={loading} />
          </Wrapper>
          <Wrapper className="text-end">
            <Link to='/sign-in'>Sign in</Link>
          </Wrapper>
        </form>
      </Content>
    </Container>
  )
}

export default SignUp

export const getServerSideProps = withSession(({ req, res }) => {
  const token = req.session.token

  if (token) {
    res.setHeader('location', '/')
    res.statusCode = 302
    res.end()
    return { 
      props: {}
    }
  }

  return {
    props: {}
  }
})
