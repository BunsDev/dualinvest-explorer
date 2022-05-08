import { useMemo, useCallback, useState, useEffect } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'
import { Box, Typography, useTheme } from '@mui/material'
import dayjs from 'dayjs'
import dayjsPluginUTC from 'dayjs-plugin-utc'
import LogoText from 'components/LogoText'
import Table from 'components/Table'
import { useOrderRecords, INVEST_TYPE, InvestStatus, useDovOrderRecords } from 'hooks/useOrderData'
import OrderStatusTag from 'components/StatusTag/OrderStatusTag'
import NoDataCard from 'components/Card/NoDataCard'
import Spinner from 'components/Spinner'
import { getMappedSymbol, SUPPORTED_CURRENCIES } from 'constants/currencies'
import Tag from 'components/Tag'
import { ExternalLink } from 'theme/components'
import { ReactComponent as ExternalIcon } from 'assets/svg/external_icon.svg'
import { routes } from 'constants/routes'
import { getEtherscanLink, shortenAddress } from 'utils'
import { usePrice } from 'hooks/usePriceSet'
import { ChainListMap } from 'constants/chain'
import { DEFI_OPTION_VAULT_LINK, DUAL_INVESTMENT_LINK, RECURRING_STRATEGY_LINK } from 'constants/links'
import useBreakpoint from 'hooks/useBreakpoint'
import { PageLayout } from 'components/PageLayout'

dayjs.extend(dayjsPluginUTC)

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

const DovTableHeaderActive = ['Token', 'Invest Amount', 'APY', 'Settlement Time', 'Strike Price', 'Exercise', '']

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
  const [order, setOrder] = useState<undefined | any>(undefined)
  const { orderId } = useParams<{ orderId: string }>()
  const history = useHistory()
  const isDownMd = useBreakpoint('md')
  const args = useMemo(() => {
    return {
      orderId
    }
  }, [orderId])

  const { orderList } = useOrderRecords(args)

  const { dovOrderList } = useDovOrderRecords(args)
  const isDov = order && !orderList?.[0]

  useEffect(() => {
    if (!orderList || orderList.length === 0) {
      if (!dovOrderList || dovOrderList.length === 0) {
        return
      } else {
        setOrder(dovOrderList[0])
        return
      }
    } else {
      return setOrder(orderList[0])
    }
  }, [dovOrderList, orderList])

  const price = usePrice(order?.investCurrency ? getMappedSymbol(order.investCurrency) : undefined)

  const isActive = useMemo(() => {
    if (!order) return

    if ([InvestStatus.Ordered, InvestStatus.ReadyToSettle].includes(+order.investStatus)) {
      return true
    }

    return false
  }, [order])

  const data = useMemo(() => {
    if (!order) return

    const hash = order.confirmOrderHash || order.hash
    const link = order.chainId && hash && getEtherscanLink(order.chainId, hash, 'transaction')

    const res: any = {
      ['Strike Price:']: order.strikePrice ? order.strikePrice + ' USDT' : undefined,
      ['Settlement Price:']: order.deliveryPrice ? order.deliveryPrice + ' USDT' : undefined,
      ['Settlement Time:']: order.expiredAt
        ? (dayjs(+order.expiredAt * 1000) as any).utc().format('MMM DD, YYYY hh:mm A') + ' UTC'
        : undefined,
      ['Product ID:']: (
        <Box display="flex" gap={12} alignItems="center">
          {isDov ? (
            <ExternalLink
              href={DEFI_OPTION_VAULT_LINK}
              underline="always"
              sx={{
                color: theme.palette.text.primary,
                textDecorationColor: theme.palette.text.primary,
                '&:hover': { opacity: 0.8 }
              }}
            >
              Vault
            </ExternalLink>
          ) : (
            <Link
              style={{ color: theme.palette.text.primary }}
              to={routes.explorerProduct.replace(':productId', `${order.productId}`)}
            >
              {order.productId}
            </Link>
          )}
          <Tag
            text={
              order.investType === INVEST_TYPE.dov
                ? 'Defi Option Vault'
                : order.investType === INVEST_TYPE.recur
                ? 'Recurring Strategy'
                : 'Dual Investment'
            }
          />
        </Box>
      ),
      ['TXID:']: hash ? (
        <Box display="flex" gap={8} alignItems="center">
          {isDownMd ? hash.slice(0, 20) + '...' : hash}
          {link && (
            <ExternalLink href={link} alt={hash}>
              <ExternalIcon />
            </ExternalLink>
          )}
        </Box>
      ) : (
        undefined
      )
    }

    return res
  }, [order, isDov, theme.palette.text.primary, isDownMd])

  const dataRows = useMemo(() => {
    if (!order) return []

    const multiplier = order ? (order.type === 'CALL' ? 1 : +order.strikePrice) : 1
    const investAmount = +order.amount * +order.multiplier * multiplier

    if (isActive) {
      const res = [
        <LogoText
          key={0}
          gapSize={'8px'}
          logo={SUPPORTED_CURRENCIES[getMappedSymbol(order.currency)].logoUrl}
          text={getMappedSymbol(order.currency)}
        />,
        `${investAmount.toFixed(2)} ${order.investCurrency}`,
        order.ts ? (dayjs(+order.ts * 1000) as any).utc().format('MMM DD, YYYY') : null,
        order.annualRor ? (
          <Typography key={0} color="#31B047" component={'span'} fontWeight={isDownMd ? 600 : undefined}>
            {order.annualRor + '%'}
          </Typography>
        ) : null,
        order.expiredAt ? (dayjs(+order.expiredAt * 1000) as any).utc().format('MMM DD, YYYY') : '-',
        order.strikePrice,
        order.type === 'CALL' ? 'Upward' : 'Downward',
        order.returnedAmount ? `${(+order.returnedAmount * multiplier).toFixed(2)} ${order.returnedCurrency}` : null,
        <OrderStatusTag key={0} order={order} />
      ]
      if (isDov) {
        res.splice(7, 1)
        res.splice(2, 1)
      }
      return [res]
    }

    return [
      [
        <ExternalLink
          key={0}
          style={{
            color: theme.palette.text.primary,
            textDecorationColor: theme.palette.text.primary,
            fontSize: isDownMd ? 16 : undefined,
            fontWeight: isDownMd ? 400 : undefined,
            display: 'block',
            marginBottom: isDownMd ? '10px' : undefined
          }}
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
        isDov ? (
          <ExternalLink
            key={0}
            sx={{
              color: theme.palette.text.primary,
              textDecorationColor: theme.palette.text.primary,
              '&:hover': { opacity: 0.8 }
            }}
            href={DEFI_OPTION_VAULT_LINK}
          >
            Vault
          </ExternalLink>
        ) : (
          <Link
            key={0}
            style={{ color: theme.palette.text.primary }}
            to={routes.explorerOrder.replace(':orderId', `${order.orderId}`)}
          >
            {order.orderId}
          </Link>
        ),
        <LogoText
          key={0}
          gapSize={'8px'}
          logo={SUPPORTED_CURRENCIES[getMappedSymbol(order.currency)].logoUrl}
          text={order.currency}
          color={isDownMd ? '#000000' : undefined}
          fontWeight={isDownMd ? 600 : 400}
          fontSize={isDownMd ? 12 : 14}
        />,
        order.type === 'CALL' ? 'Upward' : 'Downward',
        order.annualRor ? (
          <Typography key={0} color="#31B047" fontWeight={isDownMd ? 600 : 400}>
            {order.annualRor + '%'}
          </Typography>
        ) : null,
        <Box
          key={0}
          display="flex"
          alignItems={isDownMd ? 'flex-end' : 'center'}
          flexDirection={isDownMd ? 'column' : 'row'}
          marginBottom={isDownMd ? '10px' : undefined}
        >
          <Typography fontSize={isDownMd ? 12 : 14} fontWeight={isDownMd ? 600 : 400} color={'#000000'}>
            {investAmount.toFixed(6)} {order.investCurrency}
            {!isDownMd && '/'}
          </Typography>
          <Typography sx={{ opacity: 0.5 }} component="span" fontSize={isDownMd ? 11 : 14}>
            ${(price ? investAmount * +price : investAmount).toFixed(2)} USDT
          </Typography>
        </Box>,
        <OrderStatusTag key={0} order={order} />
      ]
    ]
  }, [order, isActive, theme.palette.text.primary, isDownMd, isDov, price])

  const onCancelOrderFilter = useCallback(() => {
    if (!order) return

    history.push(routes.explorerAddress.replace(':address', order.address))
  }, [order, history])

  return (
    <PageLayout
      backLink="/explorer"
      data={data}
      titleHead={
        <>
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
        </>
      }
    >
      <>
        <Box padding={'10px 24px'}>
          <Typography fontSize={16} fontWeight={500}>
            Filtered by Order Holder, Order ID
          </Typography>
          <Box display="flex" paddingTop={'20px'} gap={12} width="100%" flexWrap="wrap">
            {order?.address && (
              <Tag
                text={isDownMd ? shortenAddress(order.address, 6) : order.address}
                onClick={() => {
                  history.push(routes.explorerAddress.replace(':address', order.address))
                }}
              />
            )}
            {order?.orderId && <Tag text={`Order ID: ${order?.orderId}`} onClose={onCancelOrderFilter} />}
          </Box>
        </Box>
        <Box padding={'24px'}>
          {isActive ? (
            <Table fontSize="16px" header={isDov ? DovTableHeaderActive : TableHeaderActive} rows={dataRows} />
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
          {!isDov && orderList && orderList.length === 0 && <NoDataCard text={'Not Found'} />}
        </Box>
      </>
    </PageLayout>
  )
}
