import { Box, Container, Typography, useTheme } from '@mui/material'
import Card from 'components/Card'
import { NavLink } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from 'assets/componentsIcon/arrow_left.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import BSCUrl from 'assets/svg/binance.svg'
import LogoText from 'components/LogoText'
import FilteredBy from 'components/FilteredBy'

export default function Order() {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')
  const data = {
    ['Settlement Price:']: '140.25%',
    ['Settlement Time:']: 'Sep 21, 2021 10:42 AM',
    ['Product ID:']: '023',
    ['TXID:']: '0x35500253DEB46fa8c2b271628c65DcF159206882'
  }

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
            padding: '40px 24px 20px',
            width: '100%'
          }}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Box display="flex" flexDirection="column">
            <Typography sx={{ opacity: '0.5' }} fontSize={16}>
              Order ID
            </Typography>
            <Typography fontWeight={'700'} fontSize={'24px'}>
              #045
            </Typography>
          </Box>
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
        <Box border={'1px solid rgba(0,0,0,0.1)'} margin={'24px'} borderRadius={'20px'}>
          <Box display="flex" gap="21px" padding="28px" flexDirection="column" alignItems={'stretch'}>
            <Typography fontSize={16} fontWeight={700}>
              Overview
            </Typography>

            {Object.keys(data).map((key, idx) => (
              <Box key={idx} display="flex" justifyContent={'flex-start'}>
                <Typography fontSize={16} sx={{ opacity: 0.8 }} paddingRight={'12px'}>
                  {key}
                </Typography>

                <Typography fontWeight={400} fontSize={16}>
                  {data[key as keyof typeof data]}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box>
          <FilteredBy />
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

/* function OrderStats({ orderDetails }: { orderDetails: orderStats | undefined }) {
  const theme = useTheme()
  const data = useMemo(
    () => ({
      ['APY']: prevDetails?.apy ?? '-',
      ['Strike Price']: `${prevDetails?.strikePrice ?? '-'} USDT`,
      ['Executed Price']: `${prevDetails?.deliveryPrice ?? '-'} USDT`,
      ['Status']: prevDetails?.status ?? '-',
      ['Your P&L']: prevDetails?.pnl ?? '-',
      ['Date']: prevDetails
        ? `From ${dayjs(prevDetails.ts).format('MMM DD, YYYY')} to ${dayjs(prevDetails.expiredAt).format(
            'MMM DD, YYYY'
          )}`
        : '-'
    }),
    [prevDetails]
  )
  return (
    <Card width={'100%'}>
      <Box display="flex" gap="21px" padding="28px" flexDirection="column" alignItems={'stretch'}>
        <Typography fontSize={24} fontWeight={700}>
          Previous Cycle Statistics
        </Typography>

        {Object.keys(data).map((key, idx) => (
          <Box key={idx} display="flex" justifyContent={'space-between'}>
            <Typography fontSize={16} sx={{ opacity: 0.8 }}>
              {key}
            </Typography>

            <Typography
              fontWeight={key === 'APY' || (key === 'Status' && data.Status === 'Exercised') ? 400 : 500}
              color={
                key === 'APY' || (key === 'Status' && data.Status === 'Exercised')
                  ? theme.palette.primary.main
                  : theme.palette.text.primary
              }
            >
              {data[key as keyof typeof data]}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  )
} */
