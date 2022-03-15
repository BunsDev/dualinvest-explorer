import { useParams } from 'react-router-dom'
import { Box, Container, Typography, useTheme } from '@mui/material'
import Card from 'components/Card'
import NoDataCard from 'components/Card/NoDataCard'
import { NavLink } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from 'assets/componentsIcon/arrow_left.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import BSCUrl from 'assets/svg/binance.svg'
import LogoText from 'components/LogoText'
import FilteredBy from 'components/FilteredBy'
import StatusTag from 'components/StatusTag'
import BTC from 'assets/svg/btc_logo.svg'
import { ReactComponent as Matter } from 'assets/svg/matter_logo.svg'
import { useCallback, useMemo, useState } from 'react'
import Table from 'components/Table'
import TabButton from 'components/Button/TabButton'
import ButtonTabs from 'components/Tabs/ButtonTabs'
import { useOrderRecords, INVEST_TYPE, InvestStatus } from 'hooks/useOrderData'
import { shortenAddress, isAddress } from 'utils'
import Spinner from 'components/Spinner'
import { OrderRecord } from 'utils/fetch/record'

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

  const statusArr = useMemo(() => {
    if (tab === TableOptions.Positions) {
      return [InvestStatus.Ordered, InvestStatus.ReadyToSettle]
    }

    return undefined
  }, [tab])

  const { orderList } = useOrderRecords(address, INVEST_TYPE.recur, 'All', statusArr, 1, 999999)

  const data = {
    ['Total Invest Amount:']: '62800.00 USDT',
    ['Amount of Investing in Progress:']: '62800.00 USDT',
    ['Positions:']: '5'
  }

  const statusType = useCallback((order: OrderRecord) => {
    if ([InvestStatus.Ordered, InvestStatus.ReadyToSettle].includes(+order.investStatus)) {
      return 'pending'
    }
    if ([InvestStatus.OrderFailed, InvestStatus.EverythingFailed].includes(+order.status)) {
      return 'failed'
    }
    if (order.returnedCurrency === order.investCurrency) {
      return 'warning'
    }

    return 'success'
  }, [])

  const statusText = useCallback((order: OrderRecord) => {
    if ([InvestStatus.Ordered, InvestStatus.ReadyToSettle].includes(+order.investStatus)) {
      return 'Progressing'
    }
    if ([InvestStatus.OrderFailed, InvestStatus.EverythingFailed].includes(+order.status)) {
      return 'Failed'
    }
    if (order.investCurrency === order.returnedCurrency) {
      return 'Unexcercised'
    }
    return 'Exercised'
  }, [])

  const dataRows = useMemo(() => {
    if (!orderList) return []

    return orderList.map((order: OrderRecord) => {
      return [
        <Typography key={0} color="#3861FB">
          {order.investType === INVEST_TYPE.recur ? 'Recurring Strategy' : 'XXXXXXX'}
        </Typography>,
        <Typography key={0} color="#3861FB">
          {order.productId}
        </Typography>,
        <Typography key={0} color="#3861FB">
          {order.orderId}
        </Typography>,
        <LogoText key={0} gapSize={'8px'} logo={BTC} text={order.currency} />,
        <Typography key={0}>{order.type === 'CALL' ? 'upward' : 'downward'}</Typography>,
        <Typography key={0} color="#31B047">
          {order.annualRor + '%'}
        </Typography>,
        <Box key={0} display="flex" alignItems="flex-end">
          <Typography>
            12900/<span style={{ opacity: 0.5, fontSize: 14 }}>$235.056</span>
          </Typography>
        </Box>,
        <StatusTag key={0} type={statusType(order)} text={statusText(order)} />
      ]
    })
  }, [orderList])

  const tableTabs = useMemo(() => {
    return [
      <TabButton key={0} onClick={() => setTab(TableOptions.Positions)} selected={tab === TableOptions.Positions}>
        Positions
      </TabButton>,
      <TabButton key={0} onClick={() => setTab(TableOptions.History)} selected={tab === TableOptions.History}>
        History
      </TabButton>
    ]
  }, [tab])

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
        <Box>
          <FilteredBy />
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
