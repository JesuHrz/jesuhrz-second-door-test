import Image from 'next/image'

import { Container } from './styles'
import { BackgroundProps } from './types';

const Background:React.FC<BackgroundProps> = ({ src, alt, children }) => {
  return (
    <Container>
      <Image
        src={src}
        alt={alt}
        layout='fill'
      />
      { children }
    </Container>
  )
}

export default Background
