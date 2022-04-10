import { useMemo, useCallback } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'
import { Box, Typography, useTheme } from '@mui/material'
import Card from 'components/Card'
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
import { usePrice } from 'hooks/usePriceSet'
import { ChainListMap } from 'constants/chain'
import { DUAL_INVESTMENT_LINK, RECURRING_STRATEGY_LINK } from 'constants/links'
import GoBack from 'components/GoBack'
import useBreakpoint from 'hooks/useBreakpoint'

const TableHeaderActive = [
  'Token',
  'Invest Amount',
  'Subscribed Time',
  'APY',
  'Settlement Time',
  'Strike Price',
  'Exercise',
  'Refund Amount',
  ''
]

const TableHeaderInActive = [
  'Product Type',
  'Product ID',
  'Order ID',
  'Token',
  'Exercise',
  'APY',
  'Amount of Investing in Progress',
  ''
]

export default function Order() {
  const theme = useTheme()
  const { orderId } = useParams<{ orderId: string }>()
  const history = useHistory()
  const isDownMd = useBreakpoint('md')

  const { orderList } = useOrderRecords({
    orderId,
    pageNum: 1,
    pageSize: 999999
  })

  const order = useMemo(() => {
    if (!orderList || orderList.length === 0) return

    return orderList[0]
  }, [orderList])

  const price = usePrice(order?.investCurrency)

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

    const hash = order.confirmOrderHash || order.hash
    const link = order.chainId && hash && getEtherscanLink(order.chainId, order.hash, 'transaction')

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
          {!isDownMd && (hash || 'N/A')}
          {link && (
            <ExternalLink href={link}>
              <ExternalIcon />
            </ExternalLink>
          )}
        </Box>
      )
    }
  }, [orderList, theme])

  const dataRows = useMemo(() => {
    if (!order) return []

    const multiplier = order ? (order.type === 'CALL' ? 1 : +order.strikePrice) : 1
    const investAmount = +order.amount * +order.multiplier * multiplier

    if (isActive) {
      return [
        [
          <LogoText
            key={0}
            gapSize={'8px'}
            logo={SUPPORTED_CURRENCIES[order.currency].logoUrl}
            text={order.currency}
          />,
          <Typography key={0}>
            {investAmount.toFixed(2)} {order.investCurrency}
          </Typography>,
          <Typography key={0}>{dayjs(+order.ts * 1000).format('MMM DD, YYYY')}</Typography>,
          <Typography key={0} color="#31B047">
            {order.annualRor + '%'}
          </Typography>,
          <Typography key={0}>{dayjs(+order.expiredAt * 1000).format('MMM DD, YYYY')}</Typography>,
          <Typography key={0}>{order.strikePrice}</Typography>,
          <Typography key={0}>{order.type === 'CALL' ? 'Upward' : 'Downward'}</Typography>,
          <Typography key={0}>{(+order.returnedAmount * multiplier).toFixed(2)}</Typography>,
          <OrderStatusTag key={0} order={order} />
        ]
      ]
    }

    return [
      [
        <ExternalLink
          key={0}
          style={{ color: theme.palette.text.primary, textDecorationColor: theme.palette.text.primary }}
          href={order.investType === INVEST_TYPE.recur ? RECURRING_STRATEGY_LINK : DUAL_INVESTMENT_LINK}
          underline="always"
        >
          {order.investType === INVEST_TYPE.recur ? 'Recurring Strategy' : 'Dual Investment'}
        </ExternalLink>,
        <Link
          key={0}
          style={{ color: theme.palette.text.primary }}
          to={routes.explorerProduct.replace(':productId', `${order.productId}`)}
        >
          {order.productId}
        </Link>,
        <Link
          key={0}
          style={{ color: theme.palette.text.primary }}
          to={routes.explorerOrder.replace(':orderId', `${order.orderId}`)}
        >
          {order.orderId}
        </Link>,
        <LogoText key={0} gapSize={'8px'} logo={SUPPORTED_CURRENCIES[order.currency].logoUrl} text={order.currency} />,
        <Typography key={0}>{order.type === 'CALL' ? 'Upward' : 'Downward'}</Typography>,
        <Typography key={0} color="#31B047">
          {order.annualRor + '%'}
        </Typography>,
        <Typography key={0}>
          {investAmount} {order.investCurrency}/
          <span style={{ opacity: 0.5, fontSize: 14 }}>
            ${(price ? investAmount * +price : investAmount).toFixed(2)} USDT
          </span>
        </Typography>,
        <OrderStatusTag key={0} order={order} />
      ]
    ]
  }, [order, isActive, theme, price])

  const onCancelOrderFilter = useCallback(() => {
    if (!order) return

    history.push(routes.explorerAddress.replace(':address', order.address))
  }, [order, history])

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      marginBottom="auto"
      alignItems="center"
      padding={{ xs: '24px 12px ', md: 0 }}
    >
      <GoBack backLink="/explorer" />
      <Card style={{ margin: isDownMd ? 0 : '60px', maxWidth: theme.width.maxContent }} width={'100%'}>
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
          {order && (
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
              <LogoText
                logo={order ? ChainListMap[order?.chainId].logo : ''}
                text={order && ChainListMap[order?.chainId].symbol}
                gapSize={'8px'}
                fontSize={14}
                opacity={'0.5'}
              />
            </Box>
          )}
        </Box>
        <Box border={'1px solid rgba(0,0,0,0.1)'} margin={'24px'} borderRadius={'20px'}>
          <Box display="flex" gap="21px" padding="28px" flexDirection="column" alignItems={'stretch'}>
            <Typography fontSize={16} fontWeight={700}>
              Overview
            </Typography>

            {data &&
              Object.keys(data).map((key, idx) => (
                <Box
                  key={idx}
                  display="flex"
                  alignItems="center"
                  justifyContent={isDownMd ? 'space-between' : 'flex-start'}
                >
                  <Typography fontSize={isDownMd ? 14 : 16} sx={{ opacity: 0.8 }} paddingRight={'12px'}>
                    {key}
                  </Typography>

                  <Typography fontWeight={400} fontSize={isDownMd ? 14 : 16} component="div">
                    {data[key as keyof typeof data]}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
        <Box padding={'10px 24px'}>
          <Typography fontSize={16}>Filtered by Order Holder, Order ID</Typography>
          <Box display="flex" paddingTop={'20px'} gap={12} width="100%" flexWrap="wrap">
            {order?.address && <Tag text={order?.address} />}
            {order?.orderId && <Tag text={`${order?.orderId}`} onClose={onCancelOrderFilter} />}
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
