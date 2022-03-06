import { Box, Container, useTheme, Typography } from '@mui/material'
import Card from 'components/Card'
import { ReactComponent as Antimatter } from '../../assets/svg/antimatter.svg'
import NumericalCard from 'components/Card/NumericalCard'
import ChainSelect from 'components/Select/ChainSelect'
import { ChainList } from 'constants/chain'
import Input from 'components/Input'
import Button from 'components/Button/Button'
import { ReactComponent as SearchIcon } from 'assets/svg/search_icon.svg'

export default function Home() {
  const theme = useTheme()
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
          <Box display="flex" gap={10} position="relative" mt={21}>
            <ChainSelect chainList={ChainList} selectedChain={ChainList[0]} width="fit-content" height="48px" />
            <Input value="" placeholder="Search by Address/Order ID/Product ID" width={670} height={48} />
            <Button width="67px" height="48px" onClick={() => {}} style={{ position: 'absolute', right: 0 }}>
              <SearchIcon />
            </Button>
          </Box>
        </Container>
      </Box>

      <Container
        sx={{
          maxWidth: theme.width.maxContent
        }}
      >
        <Card>
          <Box display="flex" width="100%" gap={20}>
            <NumericalCard unit="$" value={'57,640'} subValue="Cumulative Investment Amount" border />
            <NumericalCard value={'114,375'} subValue="Total Namber Of Oders" border />
            <NumericalCard unit="Addresses" value={'367'} subValue="Cumulative Namber Of Users" border />
          </Box>
        </Card>
        <Card>
          <Box></Box>
        </Card>
      </Container>
    </Box>
  )
}
