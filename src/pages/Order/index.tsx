import { useParams } from 'react-router-dom'
import { Box, Container, Typography, useTheme } from '@mui/material'
import Card from 'components/Card'
import { NavLink } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from 'assets/componentsIcon/arrow_left.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import BSCUrl from 'assets/svg/binance.svg'
import LogoText from 'components/LogoText'
import FilteredBy from 'components/FilteredBy'
import { useMemo } from 'react'
import Table from 'components/Table'
import { useOrderRecords, INVEST_TYPE } from 'hooks/useOrderData'
import { OrderRecord } from 'utils/fetch/record'
import OrderStatusTag from 'components/StatusTag/OrderStatusTag'
import dayjs from 'dayjs'
import NoDataCard from 'components/Card/NoDataCard'
import Spinner from 'components/Spinner'
import { SUPPORTED_CURRENCIES } from 'constants/currencies'

const TableHeader = [
  'Token',
  'Invest Amount',
  'Subscribed Time',
  'APY',
  'Settlement Time',
  'Strike Price',
  'Exercise',
  'Refund Amount',
  'Status'
]

export default function Order() {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')

  const { order } = useParams<{ order: string }>()

  const { orderList } = useOrderRecords({
    investType: INVEST_TYPE.recur,
    orderId: order,
    pageNum: 1,
    pageSize: 999999
  })

  const data = useMemo(() => {
    if (!orderList || orderList.length === 0) return

    const order = orderList[0]

    return {
      ['Settlement Price:']: `${order.strikePrice}`,
      ['Settlement Time:']: dayjs(+order.expiredAt * 1000).format('MMM DD, YYYY'),
      ['Product ID:']: order.productId,
      ['TXID:']: order.confirmOrderHash
    }
  }, [orderList])

  const dataRows = useMemo(() => {
    if (!orderList) return []

    return orderList.map((order: OrderRecord) => {
      return [
        <LogoText key={0} gapSize={'8px'} logo={SUPPORTED_CURRENCIES[order.currency].logoUrl} text={order.currency} />,
        <Typography key={0}>{order.amount} USDT</Typography>,
        <Typography key={0}>{dayjs(+order.ts * 1000).format('MMM DD, YYYY')}</Typography>,
        <Typography key={0} color="#31B047">
          {order.annualRor + '%'}
        </Typography>,
        <Typography key={0}>{dayjs(+order.expiredAt * 1000).format('MMM DD, YYYY')}</Typography>,
        <Typography key={0}>{order.strikePrice}</Typography>,
        <Typography key={0}>{order.type === 'CALL' ? 'upward' : 'downward'}</Typography>,
        <Typography key={0}>{order.returnedAmount}</Typography>,
        <OrderStatusTag key={0} order={order} />
      ]
    })
  }, [orderList])

  const filterBy = useMemo(() => {
    if (!orderList) return
    const order = orderList[0]

    return { ['Address:']: order.address, ['Order ID:']: `${order.orderId}` }
  }, [orderList])

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
            <Typography fontWeight={'700'} fontSize={'24px'} mt={16}>
              #{order}
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
            <LogoText logo={BSCUrl} text={'BNB'} gapSize={'8px'} fontSize={14} opacity={'0.5'} />
          </Box>
        </Box>
        <Box border={'1px solid rgba(0,0,0,0.1)'} margin={'24px'} borderRadius={'20px'}>
          <Box display="flex" gap="21px" padding="28px" flexDirection="column" alignItems={'stretch'}>
            <Typography fontSize={16} fontWeight={700}>
              Overview
            </Typography>

            {data &&
              Object.keys(data).map((key, idx) => (
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
        <Box>{filterBy && <FilteredBy data={filterBy} />}</Box>
        <Box padding={'24px'}>
          <Table fontSize="16px" header={TableHeader} rows={dataRows} />
          {!orderList && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                width: '100%',
                height: 350,
                background: '#ffffff',
                zIndex: 3,
                borderRadius: 2
              }}
            >
              <Spinner size={60} />
            </Box>
          )}
          {orderList && orderList.length === 0 && <NoDataCard text={'Not Found'} />}
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
