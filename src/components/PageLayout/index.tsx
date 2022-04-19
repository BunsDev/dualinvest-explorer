import { Box, Typography, useTheme } from '@mui/material'
import Card from 'components/Card'
import GoBack from 'components/GoBack'
import useBreakpoint from 'hooks/useBreakpoint'
import React from 'react'

export function PageLayout({
  children,
  backLink = '/explorer',
  titleHead,
  data
}: {
  children: React.ReactNode
  backLink?: string
  titleHead: JSX.Element
  data: { [key: string]: any } | undefined
}) {
  const isDownMd = useBreakpoint('md')
  const theme = useTheme()

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      marginBottom="auto"
      alignItems="center"
      padding={{ xs: '24px 20px', md: 0 }}
    >
      <GoBack backLink={backLink} />
      <Card
        style={{
          margin: isDownMd ? 0 : '60px',
          maxWidth: theme.width.maxContent,
          paddingBottom: isDownMd ? 46 : undefined
        }}
        width={'100%'}
      >
        <Box
          sx={{
            padding: { xs: '32px 16px 0', md: '40px 24px 20px' },
            width: '100%'
          }}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          {titleHead}
        </Box>
        <Box border={'1px solid rgba(0,0,0,0.1)'} margin={{ xs: '24px 16px', md: '24px' }} borderRadius={'20px'}>
          <Box
            display="flex"
            gap={isDownMd ? '16px' : '21px'}
            padding="28px"
            flexDirection="column"
            alignItems={'stretch'}
          >
            <Typography fontSize={16} fontWeight={700}>
              Overview
            </Typography>

            {data &&
              Object.keys(data).map((key, idx) => (
                <Box
                  key={idx}
                  display={isDownMd ? 'grid' : 'flex'}
                  gap={4}
                  alignItems="center"
                  justifyContent={isDownMd ? 'space-between' : 'flex-start'}
                >
                  <Typography fontSize={isDownMd ? 12 : 16} sx={{ opacity: 0.8 }} paddingRight={'12px'}>
                    {key}
                  </Typography>

                  <Typography fontWeight={500} fontSize={16} component="div">
                    {data[key as keyof typeof data]}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
        <Box padding={{ xs: '0 16px', md: '24px' }}> {children}</Box>
      </Card>
    </Box>
  )
}
