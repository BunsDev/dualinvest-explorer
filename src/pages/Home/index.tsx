import { useMemo, useState } from 'react'
import { Box, Container, useTheme, Typography } from '@mui/material'
import Card, { OutlinedCard } from 'components/Card'
import { ReactComponent as Antimatter } from '../../assets/svg/antimatter.svg'
import NumericalCard from 'components/Card/NumericalCard'
import ChainSelect from 'components/Select/ChainSelect'
import { ChainList } from 'constants/chain'
import Input from 'components/Input'
import Button from 'components/Button/Button'
import { ReactComponent as SearchIcon } from 'assets/svg/search_icon.svg'
import Table from 'components/Table'
import LogoText from 'components/LogoText'
import DummyLogo from 'assets/svg/binance.svg'
import StatusTag from 'components/StatusTag'
import ButtonTabs from 'components/Tabs/ButtonTabs'
import OutlineButton from 'components/Button/OutlineButton'
import theme from 'theme'

enum ChainOptions {
  BSC,
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
  const [tab, setTab] = useState(ChainOptions.BSC)

  const dataRows = useMemo(() => {
    return [
      [
        <Typography key={0} color="#3861FB">
          Recurring Strategy
        </Typography>,
        <Typography key={0} color="#3861FB">
          23
        </Typography>,
        <Typography key={0} color="#3861FB">
          23
        </Typography>,
        <LogoText key={0} logo={DummyLogo} text="BTC" />,
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
      <StyledOutlineButton key={0} onClick={() => setTab(ChainOptions.BSC)} selected={tab === ChainOptions.BSC}>
        <LogoText logo={DummyLogo} text={'BSC Chain'} />
      </StyledOutlineButton>,
      <StyledOutlineButton key={0} onClick={() => setTab(ChainOptions.AVAX)} selected={tab === ChainOptions.AVAX}>
        <LogoText logo={DummyLogo} text={'AVAX Chain'} />
      </StyledOutlineButton>
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
      <Box width="100%" sx={{ background: theme.palette.background.paper }}>
        <Container
          sx={{
            maxWidth: theme.width.maxContent,
            padding: '60px 0'
          }}
        >
          <Box display="flex" gap={10} alignItems="center">
            <Antimatter />
            <Typography fontSize={24} fontWeight={400}>
              Explorer
            </Typography>
          </Box>
          <Box display="flex" gap={8} position="relative" mt={21} width={670}>
            <ChainSelect chainList={ChainList} selectedChain={ChainList[0]} width="180px" height="60px" />
            <Input value="" placeholder="Search by Address/Order ID/Product ID" width={680} height={60} />
            <Button width="220px" height="60px" onClick={() => {}} style={{ marginLeft: '24px' }}>
              <SearchIcon />
              <Typography>Search</Typography>
            </Button>
          </Box>
          <Box display="flex" gap="37px" mt={46}>
            <OutlinedCard padding="17px 20px" width={332}>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{ opacity: 0.5, fontSize: 12 }}>Currency Supported:</Typography>
                <Box display="flex" gap={12}>
                  <LogoText logo={DummyLogo} text={'BTC'} gapSize={4} fontSize={12} size="16px" />
                  <LogoText logo={DummyLogo} text={'BTC'} gapSize={4} fontSize={12} size="16px" />
                  <LogoText logo={DummyLogo} text={'BTC'} gapSize={4} fontSize={12} size="16px" />
                </Box>
              </Box>
            </OutlinedCard>

            <OutlinedCard padding="17px 20px" width={332}>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{ opacity: 0.5, fontSize: 12 }}>Chain Supported:</Typography>
                <Box display="flex" gap={12}>
                  <LogoText logo={DummyLogo} text={'BSC Chain'} gapSize={4} fontSize={12} size="16px" />
                  <LogoText logo={DummyLogo} text={'AVAX Chain'} gapSize={4} fontSize={12} size="16px" />
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
          <NumericalCard value={'114,375'} title="Total Namber Of Oders" fontSize="44px" border />
          <NumericalCard unit="Addresses" value={'367'} title="Cumulative Namber Of Users" fontSize="44px" border />
        </Box>
        <Card padding="28px 60px 68px">
          <ButtonTabs titles={tableTabs} current={tab} onChange={setTab} />
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={40}>
            <Box display="flex" gap={8}>
              <Typography fontSize={24} fontWeight={700}>
                Top Products
              </Typography>
              <LogoText logo={DummyLogo} size="28px" text="BSC" fontSize={20} />
            </Box>
            <Typography fontSize={16}>24H</Typography>
          </Box>
          <Table fontSize="16px" header={TableHeader} rows={dataRows} />
        </Card>
      </Container>
    </Box>
  )
}

function StyledOutlineButton({
  children,
  selected,
  onClick
}: {
  children: React.ReactNode

  selected?: boolean
  onClick?: () => void
}) {
  return (
    <OutlineButton
      width="136px"
      height="40px"
      color={selected ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.1)'}
      onClick={onClick}
      style={{
        background: theme.palette.background.paper
      }}
    >
      <Typography
        fontSize={16}
        color={selected ? theme.palette.primary.main : theme.palette.text.primary}
        sx={{ opacity: selected ? 1 : 0.5 }}
      >
        {children}
      </Typography>
    </OutlineButton>
  )
}
