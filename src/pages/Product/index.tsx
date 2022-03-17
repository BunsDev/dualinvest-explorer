import { Box, Container, Typography, useTheme } from '@mui/material'
import Card from 'components/Card'
import { NavLink, useParams } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from 'assets/componentsIcon/arrow_left.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import BSCUrl from 'assets/svg/binance.svg'
import LogoText from 'components/LogoText'
import FilteredBy from 'components/FilteredBy'
import StatusTag from 'components/StatusTag'
import BTC from 'assets/svg/btc_logo.svg'
import { useMemo, useState } from 'react'
import Table from 'components/Table'
import TabButton from 'components/Button/TabButton'
import ButtonTabs from 'components/Tabs/ButtonTabs'
//import TextButton from 'components/Button/TextButton'
import { useProduct } from 'hooks/useProduct'
import Button from 'components/Button/Button'
import TextButton from 'components/Button/TextButton'

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

export default function Order() {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')
  const [tab, setTab] = useState(TableOptions.Details)
  //const id = '2064'
  const { productId } = useParams<{ productId: string }>()
  //const productList = useProductList()
  const product = useProduct(productId)

  const data = {
    ['Type:']: `${product?.strikePrice ?? '-'}`,
    ['Total Invest Amount:']: '-',
    ['Positions:']: '-'
  }

  const detailsDataRows = useMemo(() => {
    return [
      [
        <LogoText key={0} gapSize={'8px'} logo={BTC} text={`${product?.currency ?? '-'}`} />,
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
    return [
      [
        <TextButton key={0} onClick={() => {}} underline fontWeight={400}>
          Recurring Strategy
        </TextButton>,
        <TextButton key={0} onClick={() => {}} underline fontWeight={400}>
          23
        </TextButton>,
        <TextButton key={0} onClick={() => {}} underline fontWeight={400}>
          23
        </TextButton>,
        <LogoText key={0} logo={BTC} text="BTC" />,
        <Typography key={0}>Downward</Typography>,
        <Typography key={0} color="#31B047">
          140.21%
        </Typography>,
        <Box key={0} display="flex" alignItems="flex-end">
          <Typography>
            12900/<span style={{ opacity: 0.5, fontSize: 14 }}>$235.056</span>
          </Typography>
        </Box>,
        <StatusTag key={0} type="pending" text="Progressing" />
      ]
    ]
  }, [])

  const tableTabs = useMemo(() => {
    return [
      <TabButton key={0} onClick={() => setTab(TableOptions.Details)} selected={tab === TableOptions.Details}>
        Details
      </TabButton>,
      <TabButton key={0} onClick={() => setTab(TableOptions.Orders)} selected={tab === TableOptions.Orders}>
        Orders
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
          <FilteredBy data={{ ['Product ID:']: '123' }} />
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
