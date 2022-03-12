import { Divider as MuiDivider, DividerProps } from '@mui/material'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  //extension must be in px
  extension?: number
  height?: number
}

export default function Divider({ extension, orientation, height, ...props }: Props & DividerProps) {
  return (
    <MuiDivider
      {...props}
      sx={{
        width: extension ? `calc(100% + ${extension * 2}px)` : orientation === 'vertical' ? '1px' : '100%',
        border: 'none',
        height: height ? height : orientation === 'vertical' ? '100%' : '1px',
        backgroundColor: 'rgba(0,0,0,0.1)',
        margin: extension ? `0 -${extension}px` : '0'
      }}
    />
  )
}
