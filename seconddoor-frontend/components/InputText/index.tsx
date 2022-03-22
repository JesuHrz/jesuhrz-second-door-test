import { Input, TextArea } from './styles'
import { InputProps } from './types';

const InputText:React.FC<InputProps> = ({
  type = 'text',
  placeholder = '',
  name = '',
  value = '',
  onChange = () => {},
  secondary = false
}): JSX.Element => {
  if (type === 'textarea') {
    return (
      <TextArea
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        secondary={secondary}
      />
    )
  }

  return (
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      name={name}
      onChange={onChange}
      secondary={secondary}
    />
  )
}

export default InputText
