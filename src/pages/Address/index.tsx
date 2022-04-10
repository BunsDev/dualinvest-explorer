import { useMemo, useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Box, Container, Typography, useTheme } from '@mui/material'
import Card from 'components/Card'
import NoDataCard from 'components/Card/NoDataCard'
import LogoText from 'components/LogoText'
import OrderStatusTag from 'components/StatusTag/OrderStatusTag'
import { ReactComponent as Matter } from 'assets/svg/matter_logo.svg'
import Table from 'components/Table'
import ButtonTabs from 'components/Tabs/ButtonTabs'
import { useOrderRecords, INVEST_TYPE, InvestStatus } from 'hooks/useOrderData'
import { shortenAddress, isAddress } from 'utils'
import Spinner from 'components/Spinner'
import { OrderRecord } from 'utils/fetch/record'
import { SUPPORTED_CURRENCIES } from 'constants/currencies'
import Tag from 'components/Tag'
import { routes } from 'constants/routes'
import Pagination from 'components/Pagination'
import { usePriceForAll } from 'hooks/usePriceSet'
import { ChainListMap } from 'constants/chain'
import { DUAL_INVESTMENT_LINK, RECURRING_STRATEGY_LINK } from 'constants/links'
import { ExternalLink } from 'theme/components'
import GoBack from 'components/GoBack'
import useBreakpoint from 'hooks/useBreakpoint'

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

  const [page, setPage] = useState(1)

  const { orderList } = useOrderRecords({
    address,
    pageNum: 1,
    pageSize: 999999
  })

  useEffect(() => {
    setPage(1)
  }, [tab])

  const chainIds = useMemo(() => {
    const chainIds = orderList?.map(order => order.chainId) || []
    return [...new Set(chainIds)]
  }, [orderList])

  const indexPrices = usePriceForAll()

  const positionList = useMemo(() => {
    if (!orderList) return []
    return orderList.filter((order: OrderRecord) =>
      [InvestStatus.Ordered, InvestStatus.ReadyToSettle].includes(+order.investStatus)
    )
  }, [orderList])

  const historyList = useMemo(() => {
    if (!orderList) return []

    return orderList
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

  const pageParams = useMemo(() => {
    const perPage = 8
    const count = Math.ceil(filteredOrderList.length / perPage)
    const total = filteredOrderList.length

    return {
      count,
      perPage,
      total
    }
  }, [filteredOrderList])

  const currentPageOrderList = useMemo(() => {
    if (!filteredOrderList) return

    return filteredOrderList.slice((page - 1) * pageParams.perPage, page * pageParams.perPage)
  }, [page, pageParams, filteredOrderList])

  const calcAmount = useCallback(
    orders => {
      return orders
        .map((order: OrderRecord) => {
          const multiplier = order.type === 'CALL' ? 1 : +order.strikePrice

          return (
            +order.amount *
            +order.multiplier *
            multiplier *
            +indexPrices[order.investCurrency as keyof typeof indexPrices]
          )
        })
        .reduce(function(acc: number, val: number) {
          return acc + val
        }, 0)
        .toFixed(2)
    },
    [indexPrices]
  )

  const data = useMemo(() => {
    return {
      ['Total Invest Amount:']: `${calcAmount(historyList)} USDT`,
      ['Amount of Investing in Progress:']: `${calcAmount(positionList)} USDT`,
      ['Positions:']: positionList?.length || 0
    }
  }, [positionList, historyList, calcAmount])

  const dataRows = useMemo(() => {
    if (!currentPageOrderList) return []

    return currentPageOrderList.map((order: OrderRecord) => {
      const multiplier = order.type === 'CALL' ? 1 : +order.strikePrice

      const investAmount = +order.amount * +order.multiplier * multiplier

      const amountU = order.investCurrency
        ? (investAmount * indexPrices[order.investCurrency as keyof typeof indexPrices]).toFixed(2)
        : ''

      return [
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
        <Box
          key={0}
          display="flex"
          alignItems={isDownMd ? 'flex-start' : 'center'}
          flexDirection={isDownMd ? 'column' : 'row'}
        >
          <Typography>
            {investAmount.toFixed(2)} {order.investCurrency}/
          </Typography>
          <Typography sx={{ opacity: 0.5 }} component="span">
            ${amountU} USDT
          </Typography>
        </Box>,
        <OrderStatusTag key={0} order={order} />
      ]
    })
  }, [currentPageOrderList, theme, indexPrices, isDownMd])

  const tableTabs = useMemo(() => {
    return ['Positions', 'History']
  }, [])

  if (!isAddress(address)) {
    return (
      <Box
        display="grid"
        width="100%"
        alignContent="flex-start"
        marginBottom="auto"
        justifyItems="center"
        gap={40}
        padding={{ xs: '24px 20px', md: 0 }}
      >
        <GoBack backLink="/explorer" />
        <NoDataCard>
          <Box display="flex" flexDirection="column">
            <Typography sx={{ opacity: '0.5' }} fontSize={16}>
              Address
            </Typography>
            <Typography fontWeight={'700'} fontSize={'24px'}>
              &apos;{address}&apos; is not a valid address
            </Typography>
          </Box>
        </NoDataCard>
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      marginBottom="auto"
      padding={{ xs: '24px 12px', md: 0 }}
    >
      <GoBack backLink="/explorer" />
      <Card style={{ margin: isDownMd ? 0 : '60px', maxWidth: theme.width.maxContent }} width={'100%'}>
        <Box
          sx={{
            padding: '40px 24px 20px',
            width: '100%'
          }}
          display="flex"
          flexDirection={isDownMd ? 'column' : 'row'}
          justifyContent="flex-start"
          alignItems="center"
          gap={12}
        >
          <Box display="flex" gap={20} alignItems="center">
            <Matter />

            <Box display="grid" gap={6}>
              <Typography sx={{ opacity: '0.5' }} fontSize={16}>
                Address
              </Typography>
              <Typography fontWeight={'700'} fontSize={'24px'}>
                {shortenAddress(address)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
            {chainIds.map(chainId => (
              <Box
                key={chainId}
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
                  logo={ChainListMap[chainId]?.logo}
                  text={ChainListMap[chainId]?.symbol}
                  gapSize={'8px'}
                  fontSize={14}
                  opacity={'0.5'}
                />
              </Box>
            ))}
          </Box>
        </Box>
        <Box border={'1px solid rgba(0,0,0,0.1)'} margin={'24px'} borderRadius={'20px'}>
          <Box display="flex" gap="21px" padding="28px" flexDirection="column" alignItems={'stretch'}>
            <Typography fontSize={16} fontWeight={700}>
              Overview
            </Typography>

            {Object.keys(data).map((key, idx) => (
              <Box key={idx} display="flex" justifyContent={isDownMd ? 'space-between' : 'flex-start'}>
                <Typography fontSize={isDownMd ? 14 : 16} sx={{ opacity: 0.8, maxWidth: 140 }} paddingRight={'12px'}>
                  {key}
                </Typography>

                <Typography fontWeight={400} fontSize={isDownMd ? 14 : 16}>
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
          {!currentPageOrderList && (
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
          {currentPageOrderList && currentPageOrderList.length === 0 && (
            <NoDataCard text={'You don’t have any positions'} />
          )}
          {currentPageOrderList && currentPageOrderList.length > 0 && (
            <Pagination
              count={pageParams.count}
              page={page}
              perPage={pageParams?.perPage}
              boundaryCount={0}
              total={pageParams?.total}
              onChange={(event, value) => setPage(value)}
            />
          )}
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
