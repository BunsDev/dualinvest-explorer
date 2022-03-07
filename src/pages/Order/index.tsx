import { Box, Container, Typography, useTheme } from '@mui/material'
import Card from 'components/Card'
import { NavLink } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from 'assets/componentsIcon/arrow_left.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import BSCUrl from 'assets/svg/binance.svg'
import LogoText from 'components/LogoText'

export default function Order() {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')

  return (
    <Box
      display="grid"
      width="100%"
      alignContent="flex-start"
      marginBottom="auto"
      justifyItems="center"
      padding={{ xs: '24px 20px', md: 0 }}
    >
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
          <NavLink to={'/account'} style={{ textDecoration: 'none' }}>
            <ArrowLeft />
            <Typography component="span" color={theme.bgColor.bg1} fontSize={{ xs: 12, md: 14 }} ml={16}>
              Go Back
            </Typography>
          </NavLink>
        </Box>
      </Box>
      <Card style={{ margin: '60px', maxWidth: theme.width.maxContent }} width={'100%'}>
        <Box
          sx={{
            padding: '40px 24px',
            width: '100%'
          }}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography sx={{ opacity: '0.5' }}>Order ID</Typography>
          <Box
            sx={{
              width: '96px',
              height: '40px',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '10px'
            }}
            display="flex"
            justifyContent={'space-evenly'}
          >
            <LogoText logo={BSCUrl} text={'BNB'} gapSize={'small'} fontSize={14} opacity={'0.5'} />
          </Box>
        </Box>
      </Card>

      <Container
        sx={{
          maxWidth: theme.width.maxContent
        }}
      ></Container>
    </Box>
  )
}
