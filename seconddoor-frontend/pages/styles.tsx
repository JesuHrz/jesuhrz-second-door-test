import styled from 'styled-components'

export const Header = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
`

export const Title = styled.h1`
  font-size: 24px;
  color: #2148C0;
  flex-basic: 100%
`

export const WrapperActions = styled.div`
  display: flex;
  gap: 5px;
`

export const LogOut = styled.button`
  font-weight: bold;
  text-transform: uppercase;
  color: #2148C0;
  padding: 12px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background: none;
`
