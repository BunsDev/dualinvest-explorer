import { styled } from '@mui/material'
import Image from '../Image'

const Wrapper = styled('div')({})

export default function LogoText({
  logo,
  text,
  fontWeight,
  fontSize,
  gapSize,
  size,
  opacity,
  color
}: {
  logo: string | JSX.Element
  text?: string | React.ReactNode
  fontWeight?: number
  fontSize?: number
  gapSize?: string | number
  size?: string
  opacity?: string
  color?: string
}) {
  return (
    <Wrapper
      sx={{
        display: 'flex',
        alignItems: 'center',
        fontWeight: fontWeight ?? 400,
        fontSize: fontSize ?? 16,
        color: color,
        '& > img, > svg': {
          marginRight: gapSize || '12px',
          height: size ? size : '20px',
          width: size ? size : '20px'
        }
      }}
    >
      {typeof logo === 'string' ? <Image src={logo as string} alt={`${text} logo`} /> : logo}
      <span style={{ opacity: opacity }}>{text}</span>
    </Wrapper>
  )
}
