import { useCallback, useMemo, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { Box, Container, useTheme, Typography } from '@mui/material'
import Card, { OutlinedCard } from 'components/Card'
import NumericalCard from 'components/Card/NumericalCard'
import { ChainId } from 'constants/chain'
import Button from 'components/Button/Button'
import { ReactComponent as SearchIcon } from 'assets/svg/search_icon.svg'
import Table from 'components/Table'
import LogoText from 'components/LogoText'
import BSCLogo from 'assets/svg/bsc_logo.svg'
import AVAXLogo from 'assets/svg/avax_logo.svg'
import StatusTag from 'components/StatusTag'
import ButtonTabs from 'components/Tabs/ButtonTabs'
import SelectInput from 'components/Input/SelectInput'
import { routes } from 'constants/routes'
import { useTopProducts } from 'hooks/useProduct'
import { TopProduct } from 'utils/fetch/product'
import { INVEST_TYPE } from 'hooks/useOrderData'
import { useStatistical } from 'hooks/useStatistical'
import { SUPPORTED_CURRENCIES, SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'
import NoDataCard from 'components/Card/NoDataCard'
import { DUAL_INVESTMENT_LINK, RECURRING_STRATEGY_LINK } from 'constants/links'
import { ExternalLink } from 'theme/components'

enum SearchOptions {
  Address = 'Address',
  Order = 'Order',
  Product = 'Product'
}

enum ChainOptions {
  BSC,
  AVAX
}

const TableHeader = ['Product Type', 'Product ID', 'Token', 'Exercise', 'Amount of Investing in Progress', 'Status']

export default function Home() {
  const theme = useTheme()
  const [tab, setTab] = useState(ChainOptions.BSC)
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
      history.push(routes.explorerOrder.replace(':orderId', search))
    }

    if (searchOption === SearchOptions.Product) {
      history.push(routes.explorerProduct.replace(':productId', search))
    }
  }, [search, searchOption, history])

  const selectedChainId = useMemo(() => {
    if (tab === ChainOptions.AVAX) {
      return ChainId.AVAX
    }

    return ChainId.BSC
  }, [tab])

  const products = useTopProducts(selectedChainId)
  const stat = useStatistical()

  const dataRows = useMemo(() => {
    return products.map((product: TopProduct) => {
      const multiplier = product.type === 'CALL' ? 1 : +product.strikePrice
      return [
        <ExternalLink
          key={0}
          style={{ color: theme.palette.text.primary, textDecorationColor: theme.palette.text.primary }}
          href={product.investType === INVEST_TYPE.recur ? RECURRING_STRATEGY_LINK : DUAL_INVESTMENT_LINK}
          underline="always"
        >
          {product.investType === INVEST_TYPE.recur ? 'Recurring Strategy' : 'Dual Investment'}
        </ExternalLink>,
        <Link
          key={0}
          style={{ color: theme.palette.text.primary }}
          to={routes.explorerProduct.replace(':productId', `${product.productId}`)}
        >
          {product.productId}
        </Link>,
        <LogoText
          key={0}
          gapSize={'8px'}
          logo={SUPPORTED_CURRENCIES[product.investCurrency]?.logoUrl}
          text={product.investCurrency}
        />,
        <Typography key={0}>{product.type === 'CALL' ? 'Upward' : 'Downward'}</Typography>,
        <Box key={0} display="flex" alignItems="flex-end">
          <Typography>
            {(+product.amountRaw * multiplier).toFixed(2)} {product.investCurrency}/
            <span style={{ opacity: 0.5, fontSize: 14 }}>${(+product.amountU).toFixed(2)} USDT</span>
          </Typography>
        </Box>,
        <StatusTag
          key={0}
          type={+product.ts > Date.now() ? 'pending' : 'success'}
          text={+product.ts > Date.now() ? 'Progressing' : 'Exercised'}
        />
      ]
    })
  }, [products, theme])

  const tableTabs = useMemo(() => {
    return [
      <LogoText key={0} logo={BSCLogo} text={'BNB Chain'} />,
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
            <Typography fontSize={44} fontWeight={700}>
              Antimatter Explorer
            </Typography>
          </Box>
          <Box display="flex" gap={24} position="relative" mt={21} width="100%">
            <Box width="100%" display="flex" gap={8}>
              <SelectInput
                placeholder={`Search by ${searchOption}`}
                options={['Address', 'Order', 'Product']}
                selected={searchOption}
                onChangeSelect={setSearchOption}
                value={search}
                onChangeInput={e => setSearch(e.target.value)}
              />
            </Box>
            <Button width="220px" height="60px" onClick={onSearch}>
              <SearchIcon />
              <Typography ml={10}>Search</Typography>
            </Button>
          </Box>
          <Box display="flex" gap="12px" mt={46} width="100%" flexWrap={'wrap'}>
            <OutlinedCard padding="17px 20px">
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{ opacity: 0.5, fontSize: 12, mr: 10 }}>Currency Supported:</Typography>
                <Box display="flex" gap={12}>
                  {SUPPORTED_CURRENCY_SYMBOL.map(symbol => (
                    <LogoText
                      key={symbol}
                      logo={SUPPORTED_CURRENCIES[symbol].logoUrl}
                      text={SUPPORTED_CURRENCIES[symbol].symbol}
                      gapSize={4}
                      fontSize={12}
                      size="16px"
                    />
                  ))}
                </Box>
              </Box>
            </OutlinedCard>

            <OutlinedCard padding="17px 20px" width={332}>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{ opacity: 0.5, fontSize: 12 }}>Chain Supported:</Typography>
                <Box display="flex" gap={12}>
                  <LogoText logo={BSCLogo} text={'BNB Chain'} gapSize={4} fontSize={12} size="16px" />
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
          <NumericalCard
            unit="$"
            value={Number(stat?.CumulativeInvestmentAmount).toLocaleString() || '-'}
            title="Cumulative Investment Amount"
            fontSize="44px"
            border
          />
          <NumericalCard
            value={stat?.TotalNamberOfOders.toLocaleString() || '-'}
            title="Total Number Of Orders"
            fontSize="44px"
            border
          />
          <NumericalCard
            unit="Addresses"
            value={stat?.CumulativeNamberOUsers.toLocaleString() || '-'}
            title="Cumulative Number Of Users"
            fontSize="44px"
            border
          />
        </Box>
        <Card padding="35px 24px 111px">
          <ButtonTabs width="136px" titles={tableTabs} current={tab} onChange={setTab} />
          <Box display="flex" gap={8} mt={40} mb={20}>
            <Typography fontSize={24} fontWeight={700}>
              Top Products
            </Typography>
            <LogoText
              logo={tab == ChainOptions.BSC ? BSCLogo : AVAXLogo}
              size="28px"
              text={tab == ChainOptions.BSC ? 'BNB' : 'AVAX'}
              fontSize={20}
              fontWeight={600}
            />
          </Box>
          <Table fontSize="16px" header={TableHeader} rows={dataRows} />
          {products && products.length === 0 && <NoDataCard text={'No data'} />}
        </Card>
      </Container>
    </Box>
  )
}
