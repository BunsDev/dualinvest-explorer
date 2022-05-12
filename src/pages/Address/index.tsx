import { useMemo, useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Box, Typography, useTheme } from '@mui/material'
import NoDataCard from 'components/Card/NoDataCard'
import LogoText from 'components/LogoText'
import OrderStatusTag from 'components/StatusTag/OrderStatusTag'
import { ReactComponent as Matter } from 'assets/svg/matter_logo.svg'
import Table from 'components/Table'
import ButtonTabs from 'components/Tabs/ButtonTabs'
import { useOrderRecords, INVEST_TYPE, InvestStatus } from 'hooks/useOrderData'
import { shortenAddress, isAddress } from 'utils'
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
import { PageLayout } from 'components/PageLayout'
import { DovVault } from './DovVault'
import { Loader } from 'components/AnimatedSvg/Loader'

enum TableOptions {
  Positions,
  History,
  Dov
}

const TableHeader = ['Product Type', 'Product ID', 'Order ID', 'Token', 'Exercise', 'APY', 'Invest Amount', '']

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
    if (!orderList) return undefined
    return orderList.filter((order: OrderRecord) =>
      [InvestStatus.Ordered, InvestStatus.ReadyToSettle].includes(+order.investStatus)
    )
  }, [orderList])

  const historyList = useMemo(() => {
    if (!orderList) return undefined
    return orderList
  }, [orderList])

  const filteredOrderList = useMemo(() => {
    if (!positionList || !historyList) {
      return undefined
    }

    if (tab === TableOptions.Positions) {
      return positionList
    }

    return historyList
  }, [tab, positionList, historyList])

  const pageParams = useMemo(() => {
    const perPage = 8
    const count = filteredOrderList ? Math.ceil(filteredOrderList.length / perPage) : 0
    const total = filteredOrderList ? filteredOrderList.length : 0

    return {
      count,
      perPage,
      total
    }
  }, [filteredOrderList])

  const currentPageOrderList = useMemo(() => {
    if (!filteredOrderList) return undefined

    return filteredOrderList.slice((page - 1) * pageParams.perPage, page * pageParams.perPage)
  }, [page, pageParams, filteredOrderList])

  const calcAmount = useCallback(
    orders => {
      return orders
        ? orders
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
        : '0.00'
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
          key={order.orderId}
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
          key={order.orderId}
          style={{ color: theme.palette.text.primary }}
          to={routes.explorerProduct.replace(':productId', `${order.productId}`)}
        >
          {order.productId}
        </Link>,
        <Link
          key={order.orderId}
          style={{ color: theme.palette.text.primary }}
          to={routes.explorerOrder.replace(':orderId', `${order.orderId}`)}
        >
          {order.orderId}
        </Link>,
        <LogoText
          key={order.orderId}
          gapSize={'8px'}
          logo={SUPPORTED_CURRENCIES[order.currency].logoUrl}
          text={order.currency}
          fontWeight={isDownMd ? 600 : undefined}
        />,
        order.type === 'CALL' ? 'Upward' : 'Downward',
        <Typography
          key={order.orderId}
          color="#31B047"
          fontSize={isDownMd ? 12 : 16}
          fontWeight={isDownMd ? 600 : undefined}
        >
          {order.annualRor + '%'}
        </Typography>,
        <Box
          key={order.orderId}
          display="flex"
          alignItems={isDownMd ? 'flex-end' : 'center'}
          flexDirection={isDownMd ? 'column' : 'row'}
          fontSize={isDownMd ? 12 : 16}
        >
          <Typography fontWeight={isDownMd ? 600 : undefined} fontSize={isDownMd ? 12 : 16}>
            {investAmount.toFixed(2)} {order.investCurrency}
            {!isDownMd && '/'}
          </Typography>
          <Typography sx={{ opacity: 0.5 }} component="span" fontSize={isDownMd ? 11 : 16}>
            ${amountU} USDT
          </Typography>
        </Box>,
        <OrderStatusTag key={order.orderId} order={order} />
      ]
    })
  }, [currentPageOrderList, theme, indexPrices, isDownMd])

  const tableTabs = useMemo(() => {
    return ['Positions', 'History', 'Defi Option Vault History']
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
        <NoDataCard text={' '}>
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
    <>
      <PageLayout
        data={data}
        titleHead={
          <>
            <Box display={isDownMd ? 'grid' : 'flex'} gap={20} alignItems="center">
              <Matter width={isDownMd ? 32 : undefined} height={isDownMd ? 32 : undefined} />

              <Box display="grid" gap={6}>
                <Typography sx={{ opacity: '0.5' }} fontSize={16}>
                  Address
                </Typography>
                <Typography fontWeight={'700'} fontSize={'24px'}>
                  {shortenAddress(address, 6)}
                </Typography>
              </Box>
            </Box>
            {!isDownMd && (
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
            )}
          </>
        }
      >
        <Box>
          <Typography fontSize={16}>Filtered by Order Holder</Typography>
          <Box paddingTop={isDownMd ? '12px' : '20px'}>
            <Tag text={address ? (isDownMd ? shortenAddress(address, 6) : address) : ''} />
          </Box>
        </Box>
        <Box paddingTop={isDownMd ? '29px' : '45px'}>
          <ButtonTabs titles={tableTabs} current={tab} onChange={setTab} padding="0 10px" />
        </Box>
        {tab === TableOptions.Dov ? (
          <DovVault account={address} />
        ) : (
          <Box padding={isDownMd ? '16px 0' : '24px 0'}>
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
                <Loader />
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
        )}
      </PageLayout>
    </>
  )
}
