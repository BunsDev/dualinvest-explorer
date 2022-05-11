import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Box, Typography, useTheme } from '@mui/material'
import { routes } from 'constants/routes'
import { DUAL_INVESTMENT_LINK, DUAL_INVEST_PRODUCT_LINK, RECURRING_STRATEGY_LINK } from 'constants/links'
import useBreakpoint from 'hooks/useBreakpoint'
import LogoText from 'components/LogoText'
import FilteredBy from 'components/FilteredBy'
import StatusTag from 'components/StatusTag'
import Table from 'components/Table'
import ButtonTabs from 'components/Tabs/ButtonTabs'
import { useApproveProduct } from 'hooks/useApproveProduct'
import { SUPPORTED_CURRENCIES } from 'constants/currencies'
import { INVEST_TYPE } from 'hooks/useOrderData'
import { OrderRecord } from 'utils/fetch/record'
import NoDataCard from 'components/Card/NoDataCard'
import PaginationView from 'components/Pagination'
import { ChainListSymbolMap } from 'constants/chain'
import Tag from 'components/Tag'
import GoBack from 'components/GoBack'
import { ExternalLink } from 'theme/components'
import OrderStatusTag from 'components/StatusTag/OrderStatusTag'
import { PageLayout } from 'components/PageLayout'
import { DovVault } from './DovVault'
import Button from 'components/Button/Button'

enum TableOptions {
  Details,
  Orders
}

const OrdersTableHeader = ['Product Type', 'Product ID', 'Order ID', 'Token', 'Exercise', 'APY', 'Invest Amount', '']

const DetailsTableHeader = ['Token', 'APY', 'Delivery Date', 'Strike Price', 'Exercise', '', '']
export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>()
  return productId.toLowerCase() === 'vault' ? <DovVault /> : <Page productId={productId} />
}

export function Page({ productId }: { productId: string }) {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState(TableOptions.Details)
  const { product, orderList, pageParams } = useApproveProduct(productId, page)

  const data = useMemo(() => {
    if (!orderList) return

    const positions = orderList?.filter(order => {
      return order.investStatus == 2 || 3
    }).length

    let sum = 0

    orderList
      ?.filter(order => {
        return order.investStatus == 2 || 3 || 4
      })
      .forEach(order => {
        sum = sum + order.amount * order.multiplier * order.strikePrice
      })

    const totalInvestAmount = sum

    return {
      ['Type:']: (
        <Box display="flex" gap={12} alignItems="center">
          <Tag text={product?.isRecur ? 'Recurring Strategy' : 'Dual Investment'} />
        </Box>
      ),
      ['Total Invest Amount:']: totalInvestAmount.toFixed(2) + ' USDT',
      ['Positions:']: positions
    }
  }, [orderList, product])

  const filterBy = useMemo(() => {
    return { ['Product ID:']: productId }
  }, [productId])

  const detailsDataRows = useMemo(() => {
    if (!product) return []

    return [
      [
        <LogoText
          key={0}
          gapSize={'8px'}
          logo={product ? SUPPORTED_CURRENCIES[product.currency].logoUrl : '?'}
          text={`${product?.currency ?? '-'}`}
        />,
        <Typography key={0} color="#31B047">
          {product?.apy}
        </Typography>,
        <Typography key={0}>{product?.expiredAt}</Typography>,
        <Typography key={0}>{product?.strikePrice} </Typography>,
        <Typography key={0}>{product?.type === 'CALL' ? 'Upward' : 'Downward'}</Typography>,

        <StatusTag
          key={0}
          type={product?.isActive ? 'pending' : 'success'}
          text={product?.isActive ? 'Progressing' : 'Finished'}
          width={isDownMd ? '100%' : undefined}
        />,
        <ExternalLink
          href={DUAL_INVEST_PRODUCT_LINK.replace(':productId', productId)}
          key={0}
          style={{
            width: isDownMd ? '100%' : '120px'
          }}
        >
          <Button
            disabled={!product?.isActive}
            height="36px"
            width={'100%'}
            style={{ borderRadius: 50, fontSize: 14, marginLeft: 'auto' }}
          >
            Subscribe now
          </Button>
        </ExternalLink>
      ]
    ]
  }, [product, productId, isDownMd])

  const ordersDataRows = useMemo(() => {
    if (!orderList) return []

    return orderList.map((order: OrderRecord) => {
      return [
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
        <Link
          key={0}
          style={{ color: theme.palette.text.primary }}
          to={routes.explorerOrder.replace(':orderId', `${order.orderId}`)}
        >
          {order.orderId}
        </Link>,
        <LogoText
          key={0}
          logo={SUPPORTED_CURRENCIES[order.currency].logoUrl}
          text={order.investCurrency}
          fontWeight={isDownMd ? 600 : undefined}
        />,
        <Typography key={0} fontWeight={isDownMd ? 600 : undefined} fontSize={isDownMd ? 12 : 16}>
          {order.type == 'CALL' ? 'Upward' : 'Downward'}
        </Typography>,
        <Typography key={0} color="#31B047" fontSize={isDownMd ? 12 : 16} fontWeight={isDownMd ? 600 : undefined}>
          {(order.annualRor * 100).toFixed(2) + '%'}
        </Typography>,
        <Box
          key={0}
          display="flex"
          alignItems={isDownMd ? 'flex-end' : 'center'}
          flexDirection={isDownMd ? 'column' : 'row'}
        >
          <Typography fontWeight={isDownMd ? 600 : undefined} fontSize={isDownMd ? 12 : 16}>
            {(order.amount * order.multiplier * order.strikePrice).toFixed(0) + ' ' + order.investCurrency}
            {!isDownMd && '/'}
          </Typography>
          <Typography sx={{ opacity: 0.5 }} component="span" fontSize={isDownMd ? 11 : 16}>
            {' '}
            {'$' + data?.['Total Invest Amount:']?.replace('USDT', '')}
          </Typography>
        </Box>,
        <OrderStatusTag key={0} order={order} />
      ]
    })
  }, [orderList, data, theme, isDownMd])

  const tableTabs = useMemo(() => {
    return ['Details', 'Orders']
  }, [])

  if (!product)
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
              Product ID
            </Typography>
            <Typography fontWeight={'700'} fontSize={'24px'} mt={6}>
              #{productId}
            </Typography>
          </Box>
        </NoDataCard>
      </Box>
    )
  return (
    <>
      <PageLayout
        backLink="/account"
        data={data}
        titleHead={
          <>
            <Box display="flex" flexDirection="column">
              <Typography sx={{ opacity: '0.5' }} fontSize={16}>
                Product ID
              </Typography>
              <Typography fontWeight={'700'} fontSize={'24px'}>
                #{productId}
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
              <LogoText
                logo={product ? ChainListSymbolMap[product.chain]?.logo : '?'}
                text={product ? ChainListSymbolMap[product.chain]?.symbol : '?'}
                gapSize={'8px'}
                fontSize={14}
                opacity={'0.5'}
              />
            </Box>
          </>
        }
      >
        <Box>
          <FilteredBy data={filterBy} />
        </Box>
        <Box paddingTop={isDownMd ? '29px' : '45px'}>
          <ButtonTabs titles={tableTabs} current={tab} onChange={setTab} />
        </Box>
        <Box padding={isDownMd ? '16px 0' : '24px 0'}>
          <Table
            fontSize="16px"
            header={tab === TableOptions.Details ? DetailsTableHeader : OrdersTableHeader}
            rows={tab === TableOptions.Details ? detailsDataRows : ordersDataRows}
          />
          {tab !== TableOptions.Details && (
            <PaginationView
              count={pageParams?.count}
              page={page}
              perPage={pageParams?.perPage}
              boundaryCount={0}
              total={pageParams?.total}
              onChange={(event, value) => setPage(value)}
            />
          )}
        </Box>
      </PageLayout>
    </>
  )
}
