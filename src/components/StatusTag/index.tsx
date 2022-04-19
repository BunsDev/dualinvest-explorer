import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'

export default function StatusTag({
  type,
  height,
  fontSize,
  text,
  width
}: {
  type: 'success' | 'pending' | 'warning' | 'failed'
  height?: string | number
  fontSize?: string | number
  text: string
  width?: string | number
}) {
  const bgcolor = useMemo(() => {
    switch (type) {
      case 'success':
        return 'rgba(49, 176, 71, 0.16)'
      case 'pending':
        return 'rgba(24, 160, 251, 0.16)'
      case 'warning':
        return 'rgba(240, 185, 11, 0.16)'
      case 'failed':
        return 'rgba(49, 176, 71, 0.16)'
    }
  }, [type])

  const textColor = useMemo(() => {
    switch (type) {
      case 'success':
        return 'rgba(49, 176, 71, 1)'
      case 'pending':
        return 'rgba(24, 160, 251, 1)'
      case 'warning':
        return 'rgba(240, 185, 11, 1)'
      case 'failed':
        return 'rgba(49, 176, 71, 1)'
    }
  }, [type])

  return (
    <Box
      borderRadius="22px"
      width={width || 'fit-content'}
      height={height || 36}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor={bgcolor}
      padding="0 11px"
    >
      <Typography fontSize={fontSize || 14} color={textColor}>
        {text}
      </Typography>
    </Box>
  )
}
