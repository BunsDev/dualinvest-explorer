import { Box, Typography } from '@mui/material'
import TextButton from 'components/Button/TextButton'

export default function Tag({ text, onClose }: { text: string; onClose?: () => void }) {
  return (
    <Box
      component="span"
      borderRadius="10px"
      sx={{ border: '1px solid transparent' }}
      color={'#11BF2D'}
      bgcolor={'rgba(17, 191, 45, 0.1)'}
      fontSize={14}
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={28}
      fontWeight={400}
    >
      <Typography padding={'0px 12px 0px 12px'}>{text}</Typography>
      {onClose && <TextButton onClick={onClose}>X</TextButton>}
    </Box>
  )
}
