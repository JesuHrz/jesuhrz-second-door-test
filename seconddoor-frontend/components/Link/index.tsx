import Link from 'next/link'
import { Anchor } from './styles'
import { LinkProps } from './types';

const CustomLink:React.FC<LinkProps> = ({ to = '', children = '' }): JSX.Element => {
  return (
    <Link href={to} passHref>
      <Anchor>{children}</Anchor>
    </Link>
  )
}

export default CustomLink
