import { Box, Container, useTheme, Typography } from '@mui/material'
import Card from 'components/Card'
import { ReactComponent as Antimatter } from '../../assets/svg/antimatter.svg'
import NumericalCard from 'components/Card/NumericalCard'

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
