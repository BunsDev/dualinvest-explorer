import { ReactComponent as ArrowLeft } from 'assets/componentsIcon/arrow_left.svg'
import { Box, Typography, useTheme } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import { NavLink } from 'react-router-dom'

export default function GoBack({ backLink }: { backLink: string }) {
  const isDownMd = useBreakpoint('md')
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        background: isDownMd ? theme.palette.background.default : theme.palette.background.paper,
        padding: isDownMd ? '0 0 28px 0' : '27px 0'
      }}
    >
      <Box maxWidth={theme.width.maxContent} width="100%">
        <NavLink to={backLink} style={{ textDecoration: 'none' }}>
          <ArrowLeft />
          <Typography component="span" color={theme.bgColor.bg1} fontSize={{ xs: 12, md: 14 }} ml={16}>
            Go Back
          </Typography>
        </NavLink>
      </Box>
    </Box>
  )
}
