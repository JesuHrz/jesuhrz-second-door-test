import { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body,
  html {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .w100 {
    width: 100%;
  }

  .mt-20 {
    margin-top: 20px;
  }
  
  .mb-5 {
    margin-bottom: 5px;
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .text-end {
    text-align: right;
  }
`
 
export default GlobalStyle