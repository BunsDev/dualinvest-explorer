import { Box, Typography } from '@mui/material'
import TextButton from 'components/Button/TextButton'

export default function Tag({ text, onClose }: { text: string; onClose?: () => void }) {
  return (
    <Box
      component="span"
      borderRadius="10px"
      color={'#11BF2D'}
      bgcolor={'rgba(17, 191, 45, 0.1)'}
      fontSize={14}
      display="flex"
      alignItems="center"
      height={28}
      fontWeight={400}
      padding={'0px 12px'}
      gap={12}
    >
      <Typography>{text}</Typography>
      {onClose && (
        <TextButton onClick={onClose} style={{ color: '#11BF2D' }}>
          X
        </TextButton>
      )}
    </Box>
  )
}
