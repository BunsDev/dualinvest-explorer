import { useMemo, useCallback } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'
import { Box, Typography, useTheme } from '@mui/material'
import Card from 'components/Card'
import { NavLink } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from 'assets/componentsIcon/arrow_left.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import BSCUrl from 'assets/svg/binance.svg'
import LogoText from 'components/LogoText'
import Table from 'components/Table'
import { useOrderRecords, INVEST_TYPE, InvestStatus } from 'hooks/useOrderData'
import OrderStatusTag from 'components/StatusTag/OrderStatusTag'
import dayjs from 'dayjs'
import NoDataCard from 'components/Card/NoDataCard'
import Spinner from 'components/Spinner'
import { SUPPORTED_CURRENCIES } from 'constants/currencies'
import Tag from 'components/Tag'
import { ExternalLink } from 'theme/components'
import { ReactComponent as ExternalIcon } from 'assets/svg/external_icon.svg'
import { routes } from 'constants/routes'
import { getEtherscanLink } from 'utils'

const TableHeaderActive = [
  'Token',
  'Invest Amount',
  'Subscribed Time',
  'APY',
  'Settlement Time',
  'Strike Price',
  'Exercise',
  'Refund Amount'
]

const TableHeaderInActive = [
  'Product Type',
  'Product ID',
  'Order ID',
  'Token',
  'Exercise',
  'APY',
  'Amount of Investing in Progress'
]

export default function Order() {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')
  const { orderId } = useParams<{ orderId: string }>()
  const history = useHistory()

  const { orderList } = useOrderRecords({
    investType: INVEST_TYPE.recur,
    orderId,
    pageNum: 1,
    pageSize: 999999
  })

  const order = useMemo(() => {
    if (!orderList || orderList.length === 0) return

    return orderList[0]
  }, [orderList])

  const multiplier = order ? (order.type === 'CALL' ? 1 : +order.strikePrice) : 1

  const isActive = useMemo(() => {
    if (!order) return

    if ([InvestStatus.Ordered, InvestStatus.ReadyToSettle].includes(+order.investStatus)) {
      return true
    }

    return false
  }, [order])

  const data = useMemo(() => {
    if (!orderList || orderList.length === 0) return

    const order = orderList[0]

    return {
      ['Settlement Price:']: order.strikePrice,
      ['Settlement Time:']: dayjs(+order.expiredAt * 1000).format('MMM DD, YYYY hh:mm A'),
      ['Product ID:']: (
        <Box display="flex" gap={12} alignItems="center">
          <Link
            style={{ color: theme.palette.text.primary }}
            to={routes.explorerProduct.replace(':productId', `${order.productId}`)}
          >
            {order.productId}
          </Link>
          <Tag text={order.investType === INVEST_TYPE.recur ? 'Recurring Strategy' : 'Dual Investment'} />
        </Box>
      ),
      ['TXID:']: (
        <Box display="flex" gap={8} alignItems="center">
          {order.confirmOrderHash}
          <ExternalLink href={getEtherscanLink(order.chainId, order.hash, 'transaction')}>
            <ExternalIcon />
          </ExternalLink>
        </Box>
      )
    }
  }, [orderList, theme])

  const dataRows = useMemo(() => {
    if (!order) return []

    if (isActive) {
      return [
        [
          <LogoText
            key={0}
            gapSize={'8px'}
            logo={SUPPORTED_CURRENCIES[order.currency].logoUrl}
            text={order.currency}
          />,
          <Typography key={0}>{(+order.amount * +order.multiplier * multiplier).toFixed(2)} USDT</Typography>,
          <Typography key={0}>{dayjs(+order.ts * 1000).format('MMM DD, YYYY')}</Typography>,
          <Typography key={0} color="#31B047">
            {order.annualRor + '%'}
          </Typography>,
          <Typography key={0}>{dayjs(+order.expiredAt * 1000).format('MMM DD, YYYY')}</Typography>,
          <Typography key={0}>{order.strikePrice}</Typography>,
          <Typography key={0}>{order.type === 'CALL' ? 'Upward' : 'Downward'}</Typography>,
          <Typography key={0}>{order.returnedAmount}</Typography>,
          <OrderStatusTag key={0} order={order} />
        ]
      ]
    }

    return [
      [
        <Link key={0} style={{ color: theme.palette.text.primary }} to={'#'}>
          {order.investType === INVEST_TYPE.recur ? 'Recurring Strategy' : 'Dual Investment'}
        </Link>,
        <Link key={0} style={{ color: theme.palette.text.primary }} to={'#'}>
          {order.productId}
        </Link>,
        <Link key={0} style={{ color: theme.palette.text.primary }} to={'#'}>
          {order.orderId}
        </Link>,
        <LogoText key={0} gapSize={'8px'} logo={SUPPORTED_CURRENCIES[order.currency].logoUrl} text={order.currency} />,
        <Typography key={0}>{order.type === 'CALL' ? 'Upward' : 'Downward'}</Typography>,
        <Typography key={0} color="#31B047">
          {order.annualRor + '%'}
        </Typography>,
        <Typography key={0}>
          {order.amount * order.multiplier} {order.investCurrency}/
          <span style={{ opacity: 0.5, fontSize: 14 }}>$XXX USDT</span>
        </Typography>,
        <OrderStatusTag key={0} order={order} />
      ]
    ]
  }, [order, isActive, theme, multiplier])

  const onCancelOrderFilter = useCallback(() => {
    if (!order) return

    history.push(routes.explorerAddress.replace(':address', order.address))
  }, [order, history])

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
              #{orderId}
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
                <Box key={idx} display="flex" alignItems="center">
                  <Typography fontSize={16} sx={{ opacity: 0.8 }} paddingRight={'12px'}>
                    {key}
                  </Typography>

                  <Typography fontWeight={400} fontSize={16} component="div">
                    {data[key as keyof typeof data]}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
        <Box padding={'10px 24px'}>
          <Typography fontSize={16}>Filtered by Order Holder, Order ID</Typography>
          <Box display="flex" paddingTop={'20px'} gap={12}>
            <Tag text={order?.address || ''} />
            <Tag text={`${order?.orderId}` || ''} onClose={onCancelOrderFilter} />
          </Box>
        </Box>
        <Box padding={'24px'}>
          {isActive ? (
            <Table fontSize="16px" header={TableHeaderActive} rows={dataRows} />
          ) : (
            <Table fontSize="16px" header={TableHeaderInActive} rows={dataRows} />
          )}
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
    </Box>
  )
}
