import '../styles/globals.tsx'
import type { AppProps } from 'next/app'
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client'
import GlobalStyle from 'styles/globals'


const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_API
  })
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <GlobalStyle />
      <Component apolloClient={client} {...pageProps}  />
      <div id='modal-root'></div>
    </ApolloProvider>
  )
}

export default MyApp
