import { useMemo } from 'react'
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
          <Box display="flex" gap={10} position="relative" mt={21} width={670}>
            <ChainSelect chainList={ChainList} selectedChain={ChainList[0]} width="fit-content" height="48px" />
            <Input value="" placeholder="Search by Address/Order ID/Product ID" width={670} height={48} />
            <Button width="67px" height="48px" onClick={() => {}} style={{ position: 'absolute', right: 0 }}>
              <SearchIcon />
            </Button>
          </Box>
          <Box display="flex" gap="37px" mt={46}>
            <OutlinedCard padding="19px 22px 18px" width={226}>
              <Box display="grid" gap={12}>
                <Typography sx={{ opacity: 0.5, fontSize: 12 }}>Currency Supported</Typography>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={16} fontWeight={700}>
                    BTC
                  </Typography>
                  <Typography fontSize={16} fontWeight={700}>
                    USDT
                  </Typography>
                  <Typography fontSize={16} fontWeight={700}>
                    ETH
                  </Typography>
                </Box>
              </Box>
            </OutlinedCard>

            <OutlinedCard padding="19px 22px 18px" width={226}>
              <Box display="grid" gap={12}>
                <Typography sx={{ opacity: 0.5, fontSize: 12 }}>Chain Supported</Typography>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={16} fontWeight={700}>
                    BSC Chain
                  </Typography>
                  <Typography fontSize={16} fontWeight={700}>
                    AVAX Chain
                  </Typography>
                </Box>
              </Box>
            </OutlinedCard>

            <OutlinedCard padding="19px 22px 18px" width={361}>
              <Box display="grid" gap={12}>
                <Typography sx={{ opacity: 0.5, fontSize: 12 }}>Live Structured Products</Typography>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={16} fontWeight={700}>
                    Dual Investment
                  </Typography>
                  <Typography fontSize={16} fontWeight={700}>
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
          pt: 16
        }}
      >
        <Card padding="25px 18px" style={{ marginBottom: 18 }}>
          <Box display="flex" width="100%" gap={20}>
            <NumericalCard unit="$" value={'57,640'} subValue="Cumulative Investment Amount" border />
            <NumericalCard value={'114,375'} subValue="Total Namber Of Oders" border />
            <NumericalCard unit="Addresses" value={'367'} subValue="Cumulative Namber Of Users" border />
          </Box>
        </Card>
        <Card padding="28px 60px 68px">
          <Box>
            <Typography fontSize={18}>Top Products</Typography>
            <Table fontSize="16px" header={TableHeader} rows={dataRows} />
          </Box>
        </Card>
      </Container>
    </Box>
  )
}
