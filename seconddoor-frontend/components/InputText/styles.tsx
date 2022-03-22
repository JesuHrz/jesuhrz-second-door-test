import styled from 'styled-components'

export const Input = styled.input`
  display: flex;
  flex: 1;
  border: 1px solid;
  border-color: ${props =>  props.secondary ? '#172b4d' : '#ffffff'};
  border-radius: 5px;
  background-color: transparent;
  padding: 12px;
  width: 100%;
  font-size: 16px;
  color: ${props =>  props.secondary ? '#172b4d' : '#ffffff'};

  &::placeholder,
  &::-webkit-input-placeholder {
    color: #ffffff; 
    color: ${props =>  props.secondary ? '#172b4d ' : '#ffffff'};
  }
  &:-ms-input-placeholder {
    color: ${props =>  props.secondary ? '#172b4d ' : '#ffffff'};
  }
`

export const TextArea = styled.textarea`
  display: flex;
  flex: 1;
  border: 1px solid;
  border-color: ${props =>  props.secondary ? '#172b4d' : '#ffffff'};
  border-radius: 5px;
  background-color: transparent;
  padding: 12px;
  width: 100%;
  font-size: 16px;
  min-height: 120px;
  color: ${props =>  props.secondary ? '#172b4d' : '#ffffff'};
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    -webkit-font-smoothing: antialiased;

  ::placeholder,
  ::-webkit-input-placeholder {
    color: #ffffff; 
    color: ${props =>  props.secondary ? '#172b4d ' : '#ffffff'};
  }
  :-ms-input-placeholder {
    color: ${props =>  props.secondary ? '#172b4d ' : '#ffffff'};
  }
`