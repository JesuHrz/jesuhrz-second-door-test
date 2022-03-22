import { WrapperStyles } from './styles'
import { WrapperProps } from './types';

const Wrapper:React.FC<WrapperProps> = ({ children = '', className = '' }): JSX.Element => {
  return (
    <WrapperStyles className={className}>
      {children}
    </WrapperStyles>
  )
}

export default Wrapper
