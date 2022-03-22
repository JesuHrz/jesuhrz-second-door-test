import styled from 'styled-components'

export const ButtonStyles = styled.input((props) => ({
  border: '1px solid #ffffff',
  borderRadius: '5px',
  backgroundColor: props.secondary ? '#2148C0' : '#ffffff',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  color: props.secondary ? '#ffffff' : '#2148C0',
  padding: '12px',
  width: '100%',
  fontSize: '16px',
  cursor: 'pointer'
}))