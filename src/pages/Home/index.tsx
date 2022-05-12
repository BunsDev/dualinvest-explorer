import { useCallback, useMemo, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { Box, useTheme, Typography, TabProps, Tab } from '@mui/material'
import Card, { OutlinedCard } from 'components/Card'
import NumericalCard from 'components/Card/NumericalCard'
import { ChainId } from 'constants/chain'
import Button from 'components/Button/Button'
import { ReactComponent as SearchIcon } from 'assets/svg/search_icon.svg'
import Table from 'components/Table'
import LogoText from 'components/LogoText'
import BSCLogo from 'assets/svg/bsc_logo.svg'
import AVAXLogo from 'assets/svg/avax_logo.svg'
import ETHLogo from 'assets/svg/eth_logo.svg'
import StatusTag from 'components/StatusTag'
import ButtonTabs from 'components/Tabs/ButtonTabs'
import SelectInput from 'components/Input/SelectInput'
import { routes } from 'constants/routes'
import { useTopProducts } from 'hooks/useProduct'
import { TopProduct } from 'utils/fetch/product'
import { INVEST_TYPE } from 'hooks/useOrderData'
import { useHomeStatistics } from 'hooks/useStatistical'
import { SUPPORTED_CURRENCIES, SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'
import NoDataCard from 'components/Card/NoDataCard'
import { DUAL_INVESTMENT_LINK, RECURRING_STRATEGY_LINK, DEFI_OPTION_VAULT_LINK } from 'constants/links'
import { ExternalLink } from 'theme/components'
import useBreakpoint from 'hooks/useBreakpoint'
import Tabs from 'components/Tabs/Tabs'
import RecentTransaction from './RecentTransaction'

enum SearchOptions {
  Address = 'Address',
  Order = 'Order',
  Product = 'Product'
}

enum ChainOptions {
  BSC,
  AVAX,
  ETH
}

const TableHeader = ['Product Type', 'Product ID', 'Token', 'Exercise', 'Amount of Investing in Progress', '']

export enum ProductType {
  dualInvest,
  dov
}

export default function Home() {
  const theme = useTheme()
  const [tab, setTab] = useState(ChainOptions.BSC)
  const [searchOption, setSearchOption] = useState(SearchOptions.Address)
  const [search, setSearch] = useState('')
  const history = useHistory()
  const isDownMd = useBreakpoint('md')
  const isDownSm = useBreakpoint('sm')

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
    if (tab === ChainOptions.ETH) {
      return ChainId.MAINNET
    }

    return ChainId.BSC
  }, [tab])

  const products = useTopProducts(selectedChainId)

  const { totalInvest, totalProgress } = useHomeStatistics()

  const dataRows = useMemo(() => {
    return products.slice(0, 10).map((product: TopProduct) => {
      const multiplier = product.type === 'CALL' ? 1 : +product.strikePrice
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
          href={
            product.investType === INVEST_TYPE.dov
              ? DEFI_OPTION_VAULT_LINK
              : product.investType === INVEST_TYPE.recur
              ? RECURRING_STRATEGY_LINK
              : DUAL_INVESTMENT_LINK
          }
          underline="always"
        >
          {product.investType === INVEST_TYPE.dov
            ? 'Defi Option Vault'
            : product.investType === INVEST_TYPE.recur
            ? 'Recurring Strategy'
            : 'Dual Investment'}
        </ExternalLink>,
        product.investType === 3 ? (
          <ExternalLink
            href={DEFI_OPTION_VAULT_LINK}
            underline="always"
            style={{ color: theme.palette.text.primary, textDecorationColor: theme.palette.text.primary }}
          >
            Vault
          </ExternalLink>
        ) : (
          <Link
            key={0}
            style={{ color: theme.palette.text.primary }}
            to={routes.explorerProduct.replace(':productId', `${product.productId}`)}
          >
            {product.productId}
          </Link>
        ),
        <LogoText
          key={0}
          gapSize={'8px'}
          fontSize={isDownMd ? 12 : 16}
          fontWeight={isDownMd ? 600 : 400}
          logo={SUPPORTED_CURRENCIES[product.investCurrency]?.logoUrl}
          text={product.investCurrency}
          color={isDownMd ? '#000000' : undefined}
        />,
        <Typography key={0} fontSize={isDownMd ? 12 : 14} fontWeight={isDownMd ? 600 : 400} color={'#000000'}>
          {product.type === 'CALL' ? 'Upward' : 'Downward'}
        </Typography>,
        <Box
          key={0}
          display="flex"
          alignItems={isDownMd ? 'flex-end' : 'center'}
          flexDirection={isDownMd ? 'column' : 'row'}
          marginBottom={isDownMd ? '10px' : undefined}
        >
          <Typography fontSize={isDownMd ? 12 : 14} fontWeight={isDownMd ? 600 : 400} color={'#000000'}>
            {(+product.amountRaw * multiplier).toFixed(2)} {product.investCurrency}
            {!isDownMd && '/'}
          </Typography>
          <Typography sx={{ opacity: 0.5 }} component="span" fontSize={isDownMd ? 11 : 14}>
            ${(+product.amountU).toFixed(2)} USDT
          </Typography>
        </Box>,
        <StatusTag
          width={isDownMd ? '100%' : undefined}
          key={0}
          type={+product.expiredAt * 1000 > Date.now() ? 'pending' : 'success'}
          text={+product.expiredAt * 1000 > Date.now() ? 'Progressing' : 'Exercised'}
        />
      ]
    })
  }, [products, theme.palette.text.primary, isDownMd])

  const tableTabs = useMemo(() => {
    return [
      <LogoText key={0} logo={BSCLogo} text={'BNB Chain'} />,
      <LogoText key={1} logo={AVAXLogo} text={'AVAX Chain'} />,
      <LogoText key={2} logo={ETHLogo} text={'Ethereum'} />
    ]
  }, [])

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      alignContent="flex-start"
      marginBottom="auto"
      justifyItems="center"
    >
      <Box
        width="100%"
        sx={{
          background: theme.palette.background.paper,
          padding: { xs: '32px 20px', md: '60px 15px' }
        }}
      >
        <Box
          sx={{
            maxWidth: {
              xs: '100%',
              md: theme.width.maxContent
            },
            margin: '0 auto'
          }}
        >
          <Box display="flex" gap={10} alignItems="center" width="100%">
            <Typography sx={{ fontSize: { xs: 32, md: 44 } }} fontWeight={700}>
              Antimatter Explorer
            </Typography>
          </Box>
          <Box display={{ xs: 'grid', sm: 'flex' }} gap={isDownMd ? 12 : 24} position="relative" mt={21} width="100%">
            <SelectInput
              onSearch={onSearch}
              placeholder={`Search by ${searchOption}`}
              options={['Address', 'Order', 'Product']}
              selected={searchOption}
              onChangeSelect={setSearchOption}
              value={search}
              onChangeInput={e => setSearch(e.target.value)}
            />
            <Button width={isDownSm ? '100%' : '220px'} height={'60px'} onClick={onSearch}>
              <SearchIcon />
              <Typography ml={10}>Search</Typography>
            </Button>
          </Box>
          <Box mt={{ xs: 28, sm: 46 }} width="100%">
            <OutlinedCard padding="17px 20px" width={isDownMd ? '100%' : 'fit-content'}>
              <Box display={{ xs: 'grid', sm: 'flex' }} justifyContent="space-between" gap={8}>
                <Typography sx={{ opacity: 0.5, fontSize: 12, mr: 10, whiteSpace: 'nowrap' }}>
                  Currency Supported:
                </Typography>
                <Box
                  display="flex"
                  gap={12}
                  width="100%"
                  flexWrap="wrap"
                  justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
                >
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
            <Box display="flex" gap={12} mt={12} flexDirection={isDownMd ? 'column' : 'row'}>
              <OutlinedCard padding="17px 20px" width={isDownMd ? '100%' : 'fit-content'}>
                <Box display={{ xs: 'grid', sm: 'flex' }} justifyContent="space-between" gap={8}>
                  <Typography sx={{ opacity: 0.5, fontSize: 12, mr: 10, whiteSpace: 'nowrap' }}>
                    Chain Supported:
                  </Typography>
                  <Box
                    display="flex"
                    gap={12}
                    width="100%"
                    flexWrap="wrap"
                    justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
                  >
                    <LogoText logo={BSCLogo} text={'BNB Chain'} gapSize={4} fontSize={12} size="16px" />
                    <LogoText logo={AVAXLogo} text={'AVAX Chain'} gapSize={4} fontSize={12} size="16px" />
                  </Box>
                </Box>
              </OutlinedCard>

              <OutlinedCard padding="17px 20px" width={isDownMd ? '100%' : 'fit-content'}>
                <Box display={{ xs: 'grid', sm: 'flex' }} justifyContent="space-between" gap={8}>
                  <Typography sx={{ opacity: 0.5, fontSize: 12, mr: 10, whiteSpace: 'nowrap' }}>
                    Live Structured Products:
                  </Typography>
                  <Box display="flex" gap={12} flexWrap="wrap" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
                    <Typography fontSize={12} fontWeight={400} sx={{ opacity: 0.5 }}>
                      Dual Investment
                    </Typography>
                    <Typography fontSize={12} fontWeight={400} sx={{ opacity: 0.5 }}>
                      Recurring Strategy
                    </Typography>
                    <Typography fontSize={12} fontWeight={400} sx={{ opacity: 0.5 }}>
                      Defi Option Vault
                    </Typography>
                  </Box>
                </Box>
              </OutlinedCard>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          maxWidth: theme.width.maxContent,
          padding: { xs: '38px 20px', sm: '80px 0' },
          margin: '0 auto'
        }}
      >
        <Box display="flex" width="100%" gap={20} mb={41} flexDirection={isDownMd ? 'column' : 'row'}>
          <NumericalCard
            width={'100%'}
            title={isDownMd ? undefined : 'Total investment amount'}
            value={totalInvest}
            fontSize={isDownMd ? '20px' : '44px'}
            unit="USDT"
            unitSize={isDownMd ? '12px' : '16px'}
            border
            subValue={isDownMd ? 'Total investment amount' : undefined}
            padding="24px"
          />
          <NumericalCard
            width={'100%'}
            title={isDownMd ? undefined : 'Amount of investment in progress'}
            value={totalProgress}
            fontSize={isDownMd ? '20px' : '44px'}
            unit="USDT"
            unitSize={isDownMd ? '12px' : '16px'}
            border
            subValue={isDownMd ? 'Amount of investment in progress' : undefined}
            padding="24px"
          />
        </Box>
        <Box padding={'60px 0 40px'}>
          <Tabs
            titles={['Recent Transactions', 'Top Products']}
            contents={[
              <Card padding={isDownSm ? '32px 16px 80px' : '40px 24px 111px'} key="txn" style={{ marginTop: 30 }}>
                <Box>
                  <Box display="flex" gap={8} mt={10} mb={20}>
                    <Typography fontSize={24} fontWeight={700} mr={16}>
                      Recent Transactions
                    </Typography>
                  </Box>
                  <RecentTransaction />
                </Box>
              </Card>,
              <Card padding={isDownSm ? '32px 16px 80px' : '40px 24px 111px'} key="products" style={{ marginTop: 30 }}>
                <Box>
                  <ButtonTabs width="136px" titles={tableTabs} current={tab} onChange={setTab} />
                  <Box display="flex" gap={8} mt={10} mb={20}>
                    <Typography fontSize={24} fontWeight={700} mr={16}>
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
                </Box>
              </Card>
            ]}
            CustomTab={CustomTab}
            centered
          />
        </Box>
      </Box>
    </Box>
  )
}

export function CustomTab(props: TabProps & { selected?: boolean }) {
  return (
    <Tab
      {...props}
      sx={{
        textTransform: 'none',
        borderRadius: 1,
        // color: theme => theme.palette.primary.main,
        background: '#ffffff',
        border: '1px solid #ffffff',
        margin: '0 5px',
        borderColor: '#ffffff',
        opacity: 1,
        '&.Mui-selected': {
          color: '#ffffff',
          borderColor: theme => theme.palette.primary.main,
          background: theme => theme.palette.primary.main
        },
        '&:hover': {
          borderColor: theme => theme.palette.primary.main
        }
      }}
    />
  )
}
