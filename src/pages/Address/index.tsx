import { useParams, Link } from 'react-router-dom'
import { Box, Container, Typography, useTheme } from '@mui/material'
import Card from 'components/Card'
import NoDataCard from 'components/Card/NoDataCard'
import { NavLink } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from 'assets/componentsIcon/arrow_left.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import BSCUrl from 'assets/svg/binance.svg'
import LogoText from 'components/LogoText'
import OrderStatusTag from 'components/StatusTag/OrderStatusTag'
import { ReactComponent as Matter } from 'assets/svg/matter_logo.svg'
import { useMemo, useState } from 'react'
import Table from 'components/Table'
import ButtonTabs from 'components/Tabs/ButtonTabs'
import { useOrderRecords, INVEST_TYPE, InvestStatus } from 'hooks/useOrderData'
import { shortenAddress, isAddress } from 'utils'
import Spinner from 'components/Spinner'
import { OrderRecord } from 'utils/fetch/record'
import { SUPPORTED_CURRENCIES } from 'constants/currencies'
import Tag from 'components/Tag'

enum TableOptions {
  Positions,
  History
}

const TableHeader = [
  'Product Type',
  'Product ID',
  'Order ID',
  'Token',
  'Exercise',
  'APY',
  'Amount of Investing in Progress',
  'Status'
]

export default function Address() {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')
  const [tab, setTab] = useState(TableOptions.Positions)

  const { address } = useParams<{ address: string }>()

  // const [page, setPage] = useState(1)

  const { orderList } = useOrderRecords({
    investType: INVEST_TYPE.recur,
    address,
    pageNum: 1,
    pageSize: 999999
  })

  const positionList = useMemo(() => {
    if (!orderList) return []
    return orderList.filter((order: OrderRecord) =>
      [InvestStatus.Ordered, InvestStatus.ReadyToSettle].includes(+order.investStatus)
    )
  }, [orderList])

  const historyList = useMemo(() => {
    return orderList || []
  }, [orderList])

  const filteredOrderList = useMemo(() => {
    if (!positionList || !historyList) {
      return []
    }

    if (tab === TableOptions.Positions) {
      return positionList
    }

    return historyList
  }, [tab, positionList, historyList])

  const totalAmount = useMemo(() => {
    return historyList
      .map((order: OrderRecord) => +order.amount)
      .reduce(function(acc: number, val: number) {
        return acc + val
      }, 0)
  }, [historyList])

  const AmountInProgress = useMemo(() => {
    return positionList
      .map((order: OrderRecord) => +order.amount)
      .reduce(function(acc: number, val: number) {
        return acc + val
      }, 0)
  }, [positionList])

  const data = useMemo(() => {
    return {
      ['Total Invest Amount:']: `${totalAmount} USDT`,
      ['Amount of Investing in Progress:']: `${AmountInProgress} USDT`,
      ['Positions:']: positionList?.length || 0
    }
  }, [positionList, totalAmount, AmountInProgress])

  const dataRows = useMemo(() => {
    if (!filteredOrderList) return []

    return filteredOrderList.map((order: OrderRecord) => {
      return [
        <Typography key={0}>
          <Link style={{ color: theme.palette.text.primary }} to={'#'}>
            {order.investType === INVEST_TYPE.recur ? 'Recurring Strategy' : 'Dual Investment'}
          </Link>
        </Typography>,
        <Typography key={0}>
          <Link style={{ color: theme.palette.text.primary }} to={'#'}>
            {order.productId}
          </Link>
        </Typography>,
        <Typography key={0}>
          <Link style={{ color: theme.palette.text.primary }} to={'#'}>
            {order.orderId}
          </Link>
        </Typography>,
        <LogoText key={0} gapSize={'8px'} logo={SUPPORTED_CURRENCIES[order.currency].logoUrl} text={order.currency} />,
        <Typography key={0}>{order.type === 'CALL' ? 'upward' : 'downward'}</Typography>,
        <Typography key={0} color="#31B047">
          {order.annualRor + '%'}
        </Typography>,
        <Box key={0} display="flex" alignItems="flex-end">
          <Typography>
            {order.amount}/<span style={{ opacity: 0.5, fontSize: 14 }}>$XXX</span>
          </Typography>
        </Box>,
        <OrderStatusTag key={0} order={order} />
      ]
    })
  }, [filteredOrderList])

  const tableTabs = useMemo(() => {
    return ['Positions', 'History']
  }, [])

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
          justifyContent="flex-start"
          alignItems="center"
        >
          <Box display="flex" gap={20} alignItems="center">
            <Matter />

            <Box display="grid" gap={6}>
              <Typography sx={{ opacity: '0.5' }} fontSize={16}>
                Address
              </Typography>
              <Typography fontWeight={'700'} fontSize={'24px'}>
                {isAddress(address) ? shortenAddress(address) : 'Not Valid Address'}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: '96px',
              height: '40px',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '10px',
              marginLeft: 'auto'
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
        <Box padding={'10px 24px'}>
          <Typography fontSize={16}>Filtered by Order Holder</Typography>
          <Box paddingTop={'20px'}>
            <Tag text={address || ''} />
          </Box>
        </Box>
        <Box padding={'24px 24px 0px'}>
          <ButtonTabs titles={tableTabs} current={tab} onChange={setTab} />
        </Box>
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
          {orderList && orderList.length === 0 && <NoDataCard text={'You don’t have any positions'} />}
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
