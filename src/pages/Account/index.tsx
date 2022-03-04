import { Box, Container, Typography, useTheme } from '@mui/material'

export default function Account() {
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
          <Typography fontSize={44} fontWeight={700}>
            Antimatter Explorer
          </Typography>{' '}
        </Container>
      </Box>

      <Container
        sx={{
          maxWidth: theme.width.maxContent
        }}
      ></Container>
    </Box>
  )
}
