import { ButtonStyles } from './styles'
import { ButtonProps } from './types';

const Button:React.FC<ButtonProps> = ({
  type = 'button',
  value = '',
  disabled = false,
  onClick = () => {},
  secondary = false
}): JSX.Element => {
  return (
    <ButtonStyles
      type={type}
      value={value}
      onClick={onClick}
      disabled={disabled}
      secondary={secondary}
    />
  )
}

export default Button
