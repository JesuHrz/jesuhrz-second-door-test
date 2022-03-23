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
} from './styles'
import InputText from 'components/InputText'
import Button from 'components/Button'
import Wrapper from 'components/Wrapper'
import Link from 'components/Link'

import { SIGN_IN } from 'utils/graphql/mutations'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
const API_URL = `${DOMAIN}/api/auth`

const SignIn: NextPage = () => {
  const router = useRouter()
  const [handleSingIn, { loading, error }] = useMutation(SIGN_IN)

  const { setValues, ...formik } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async values => {
      try {
        const { data } = await handleSingIn({
          variables: {
            email: values.email,
            password: values.password
          }
        })

        await axios.post(API_URL, { jwt: data.auth.jwt })

        router.push('/')
      } catch (error) {
        console.log('Error', error)
      }
    }
  })

  return (
    <Container>
      <Head>
        <title>Sign In</title>
      </Head>
      <Background
        src='/images/sign-in.png'
        alt='Sign in background'
      />
      <Content>
        <Title>Sign In</Title>
        <form className="w100" onSubmit={formik.handleSubmit} autoComplete='off'>
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
            <Button type='submit' value='Login' disabled={loading} />
          </Wrapper>
          <Wrapper className="text-end">
            <Link to='/sign-up'>Sign up for an account</Link>
          </Wrapper>
        </form>
      </Content>
    </Container>
  )
}

export default SignIn

export const getServerSideProps = withSession(({ req, res }) => {
  const token = req.session.get('token')
  console.log('token')

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
