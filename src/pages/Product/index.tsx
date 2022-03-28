import { Box, Container, Typography, useTheme } from '@mui/material'
import Card from 'components/Card'
import { NavLink, useParams } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from 'assets/componentsIcon/arrow_left.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import LogoText from 'components/LogoText'
import FilteredBy from 'components/FilteredBy'
import StatusTag from 'components/StatusTag'
import { useMemo, useState } from 'react'
import Table from 'components/Table'
import ButtonTabs from 'components/Tabs/ButtonTabs'
//import { useProduct } from 'hooks/useProduct'
import { useApproveProduct } from 'hooks/useApproveProduct'
import Button from 'components/Button/Button'
import TextButton from 'components/Button/TextButton'
import { SUPPORTED_CURRENCIES } from 'constants/currencies'
import { INVEST_TYPE /* useOrderRecords*/ } from 'hooks/useOrderData'
import { OrderRecord } from 'utils/fetch/record'
import NoDataCard from 'components/Card/NoDataCard'
import PaginationView from 'components/Pagination'
import { SUPPORTED_CHAINS } from 'constants/chain'

enum TableOptions {
  Details,
  Orders
}

const OrdersTableHeader = [
  'Product Type',
  'Product ID',
  'Order ID',
  'Token',
  'Exercise',
  'APY',
  'Amount of Investing in Progress',
  'Status'
]

const DetailsTableHeader = ['Token', 'APY', 'Delivery Date', 'Strike Price', 'Exercise', '', '']

export default function Page() {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState(TableOptions.Details)
  //const id = '2064'
  const { productId } = useParams<{ productId: string }>()
  //const productList = useProductList()
  const { product, orderList, pageParams } = useApproveProduct(productId, page)

  // const { orderList } = useOrderRecords({
  //   //investType: product?.type == 'CALL' ? INVEST_TYPE.dualInvest : INVEST_TYPE.recur,
  //   investType: INVEST_TYPE.DO_NOT_USE_THIS,
  //   productId: productId,
  //   pageNum: 1,
  //   pageSize: 999999
  // })

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
      ['Type:']: product?.isRecur ? 'Recurring Strategy' : !product?.isRecur ? 'Dual Investment' : '-',
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
        <Typography key={0}>{product?.type === 'CALL' ? 'Up' : 'Down'}</Typography>,

        <StatusTag
          key={0}
          type={product?.isActive ? 'pending' : 'success'}
          text={product?.isActive ? 'Progressing' : 'Finished'}
        />,
        <Button
          key={0}
          height="36px"
          width={isDownMd ? '100%' : '120px'}
          style={{ borderRadius: 50, fontSize: 14, marginLeft: 'auto' }}
          onClick={() => {}}
        >
          Subscribe now
        </Button>
      ]
    ]
  }, [product, isDownMd])

  const ordersDataRows = useMemo(() => {
    if (!orderList) return []

    return orderList.map((order: OrderRecord) => {
      return [
        <TextButton key={0} onClick={() => {}} underline fontWeight={400}>
          {order.investType == INVEST_TYPE.dualInvest ? 'Dual Investment' : 'Recurring Strategy'}
        </TextButton>,
        <TextButton key={0} onClick={() => {}} underline fontWeight={400}>
          {order.productId}
        </TextButton>,
        <TextButton key={0} onClick={() => {}} underline fontWeight={400}>
          {order.orderId}
        </TextButton>,
        <LogoText key={0} logo={SUPPORTED_CURRENCIES[order.currency].logoUrl} text={order.investCurrency} />,
        <Typography key={0}>{order.type == 'CALL' ? 'Upward' : 'Downward'}</Typography>,
        <Typography key={0} color="#31B047">
          {(order.annualRor * 100).toFixed(2) + '%'}
        </Typography>,
        <Box key={0} display="flex" alignItems="flex-end">
          <Typography>
            {(order.amount * order.multiplier * order.strikePrice).toFixed(0) + ' USDT/'}
            <span style={{ opacity: 0.5, fontSize: 14 }}>
              {'$' + data?.['Total Invest Amount:']?.replace('USDT', '')}
            </span>
          </Typography>
        </Box>,
        <StatusTag key={0} type="pending" text="Progressing" />
      ]
    })
  }, [orderList, data])

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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            background: isDownMd ? theme.palette.background.default : theme.palette.background.paper,
            padding: isDownMd ? '0 0 28px 0' : '27px 20px'
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

        <NoDataCard>
          <Box display="flex" flexDirection="column">
            <Typography sx={{ opacity: '0.5' }} fontSize={16}>
              Product ID
            </Typography>
            <Typography fontWeight={'700'} fontSize={'24px'}>
              #{productId}
            </Typography>
          </Box>
        </NoDataCard>
      </Box>
    )
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
              logo={product ? SUPPORTED_CHAINS[product.chain].logo : '?'}
              text={product ? SUPPORTED_CHAINS[product.chain].symbol : '?'}
              gapSize={'8px'}
              fontSize={14}
              opacity={'0.5'}
            />
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
        <Box>
          <FilteredBy data={filterBy} />
        </Box>
        <Box padding={'24px 24px 0px'}>
          <ButtonTabs titles={tableTabs} current={tab} onChange={setTab} />
        </Box>
        <Box padding={'24px'}>
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
      </Card>

      <Container
        sx={{
          maxWidth: theme.width.maxContent
        }}
      ></Container>
    </Box>
  )
}
