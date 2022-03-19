import { useCallback, useMemo, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { Box, Container, useTheme, Typography } from '@mui/material'
import Card, { OutlinedCard } from 'components/Card'
// import { ReactComponent as Antimatter } from '../../assets/svg/antimatter.svg'
import NumericalCard from 'components/Card/NumericalCard'
import ChainSelect from 'components/Select/ChainSelect'
import { ChainList } from 'constants/chain'
// import Input from 'components/Input'
import Button from 'components/Button/Button'
import { ReactComponent as SearchIcon } from 'assets/svg/search_icon.svg'
import BTCLogo from 'assets/svg/btc_logo.svg'
import Table from 'components/Table'
import LogoText from 'components/LogoText'
import BNBLogo from 'assets/svg/binance.svg'
import AVAXLogo from 'assets/svg/avax_logo.svg'
import StatusTag from 'components/StatusTag'
import ButtonTabs from 'components/Tabs/ButtonTabs'
// import TextButton from 'components/Button/TextButton'
import { Chain } from 'models/chain'
import SelectInput from 'components/Input/SelectInput'
import { routes } from 'constants/routes'
import { useTopProducts } from 'hooks/useProduct'
import { TopProduct } from 'utils/fetch/product'
import { INVEST_TYPE } from 'hooks/useOrderData'
import BTC from 'assets/svg/btc_logo.svg'

enum SearchOptions {
  Address = 'Address',
  Order = 'Order',
  Product = 'Product'
}

enum ChainOptions {
  BNB,
  AVAX
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

export default function Home() {
  const theme = useTheme()
  const [tab, setTab] = useState(ChainOptions.BNB)
  const [chain, setChain] = useState<Chain | null>(ChainList[0])
  const [searchOption, setSearchOption] = useState(SearchOptions.Address)
  const [search, setSearch] = useState('')
  const history = useHistory()

  const onSearch = useCallback(() => {
    if (!search || !searchOption) {
      return
    }

    if (searchOption === SearchOptions.Address) {
      history.push(routes.explorerAddress.replace(':address', search))
    }

    if (searchOption === SearchOptions.Order) {
      history.push(routes.explorerOrder.replace(':order', search))
    }
  }, [search, searchOption, history])

  const products = useTopProducts()

  const dataRows = useMemo(() => {
    return products.map((product: TopProduct) => {
      return [
        <Typography key={0}>
          <Link style={{ color: theme.palette.text.primary }} to={'#'}>
            {product.investType === INVEST_TYPE.recur ? 'Recurring Strategy' : 'XXXXXXX'}
          </Link>
        </Typography>,
        <Typography key={0}>
          <Link style={{ color: theme.palette.text.primary }} to={'#'}>
            {product.productId}
          </Link>
        </Typography>,
        <Typography key={0}>
          <Link style={{ color: theme.palette.text.primary }} to={'#'}>
            XXX
          </Link>
        </Typography>,
        <LogoText key={0} gapSize={'8px'} logo={BTC} text={product.investCurrency} />,
        <Typography key={0}>XXX</Typography>,
        <Typography key={0} color="#31B047">
          XXX%
        </Typography>,
        <Box key={0} display="flex" alignItems="flex-end">
          <Typography>
            {product.amount} USDT/<span style={{ opacity: 0.5, fontSize: 14 }}>$XXX</span>
          </Typography>
        </Box>,
        <StatusTag key={0} type={'pending'} text={'Progressing'} />
      ]
    })
  }, [products])

  const tableTabs = useMemo(() => {
    return [
      <LogoText key={0} logo={BNBLogo} text={'BNB Chain'} />,
      <LogoText key={0} logo={AVAXLogo} text={'AVAX Chain'} />
    ]
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
      <Box width="100%" sx={{ background: theme.palette.background.paper }}>
        <Container
          sx={{
            maxWidth: theme.width.maxContent,
            padding: '60px 0'
          }}
        >
          <Box display="flex" gap={10} alignItems="center">
            {/* <Antimatter /> */}
            <Typography fontSize={44} fontWeight={700}>
              Antimatter Explorer
            </Typography>
          </Box>
          <Box display="flex" gap={24} position="relative" mt={21} width="100%">
            <Box width="100%" display="flex" gap={8}>
              <ChainSelect
                chainList={ChainList}
                selectedChain={chain}
                onChange={setChain}
                width="180px"
                height="60px"
              />
              <SelectInput
                placeholder={`Search by ${searchOption}`}
                options={['Address', 'Order', 'Product']}
                selected={searchOption}
                onChangeSelect={setSearchOption}
                value={search}
                onChangeInput={e => setSearch(e.target.value)}
              />
            </Box>
            <Button width="220px" height="60px" onClick={onSearch} style={{ marginLeft: '24px' }}>
              <SearchIcon />
              <Typography ml={10}>Search</Typography>
            </Button>
          </Box>
          <Box display="flex" gap="12px" mt={46} width="100%">
            <OutlinedCard padding="17px 20px" width={332}>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{ opacity: 0.5, fontSize: 12 }}>Currency Supported:</Typography>
                <Box display="flex" gap={12}>
                  <LogoText logo={BTCLogo} text={'BTC'} gapSize={4} fontSize={12} size="16px" />
                  <LogoText logo={BTCLogo} text={'BTC'} gapSize={4} fontSize={12} size="16px" />
                  <LogoText logo={BTCLogo} text={'BTC'} gapSize={4} fontSize={12} size="16px" />
                </Box>
              </Box>
            </OutlinedCard>

            <OutlinedCard padding="17px 20px" width={332}>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{ opacity: 0.5, fontSize: 12 }}>Chain Supported:</Typography>
                <Box display="flex" gap={12}>
                  <LogoText logo={BNBLogo} text={'BNB Chain'} gapSize={4} fontSize={12} size="16px" />
                  <LogoText logo={AVAXLogo} text={'AVAX Chain'} gapSize={4} fontSize={12} size="16px" />
                </Box>
              </Box>
            </OutlinedCard>

            <OutlinedCard padding="17px 20px" width={424}>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{ opacity: 0.5, fontSize: 12 }}>Live Structured Products:</Typography>
                <Box display="flex" gap={12}>
                  <Typography fontSize={12} fontWeight={400} sx={{ opacity: 0.5 }}>
                    Dual Investment
                  </Typography>
                  <Typography fontSize={12} fontWeight={400} sx={{ opacity: 0.5 }}>
                    Recurring Strategy
                  </Typography>
                </Box>
              </Box>
            </OutlinedCard>
          </Box>
        </Container>
      </Box>

      <Container
        sx={{
          maxWidth: theme.width.maxContent,
          pt: 80
        }}
      >
        <Box display="flex" width="100%" gap={20} mb={41}>
          <NumericalCard unit="$" value={'57,640'} title="Cumulative Investment Amount" fontSize="44px" border />
          <NumericalCard value={'114,375'} title="Total Number Of Orders" fontSize="44px" border />
          <NumericalCard unit="Addresses" value={'367'} title="Cumulative Number Of Users" fontSize="44px" border />
        </Box>
        <Card padding="28px 60px 68px">
          <ButtonTabs width="136px" titles={tableTabs} current={tab} onChange={setTab} />
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={40}>
            <Box display="flex" gap={8}>
              <Typography fontSize={24} fontWeight={700}>
                Top Products
              </Typography>
              <LogoText logo={BNBLogo} size="28px" text="BNB" fontSize={20} />
            </Box>
            <Typography fontSize={16}>24H</Typography>
          </Box>
          <Table fontSize="16px" header={TableHeader} rows={dataRows} />
        </Card>
      </Container>
    </Box>
  )
}
