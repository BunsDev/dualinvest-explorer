import { Typography } from '@mui/material'
import theme from 'theme'
import OutlineButton from './OutlineButton'

export default function TabButton({
  children,
  selected,
  onClick
}: {
  children: React.ReactNode

  selected?: boolean
  onClick?: () => void
}) {
  return (
    <OutlineButton
      width="136px"
      height="40px"
      color={selected ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.1)'}
      onClick={onClick}
      style={{
        background: theme.palette.background.paper
      }}
    >
      <Typography
        fontSize={16}
        color={selected ? theme.palette.primary.main : theme.palette.text.primary}
        sx={{ opacity: selected ? 1 : 0.5 }}
      >
        {children}
      </Typography>
    </OutlineButton>
  )
}
