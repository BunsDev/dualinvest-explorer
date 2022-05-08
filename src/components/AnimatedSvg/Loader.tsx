import { Box } from '@mui/material'
import AnimatedSvg from '.'

export function Loader({ color, margin = '0 auto', size = 200 }: { color?: string; margin?: string; size?: number }) {
  return (
    <Box width={size} height={size} margin={margin}>
      <AnimatedSvg
        fileName="loader"
        sx={{
          '& path': {
            stroke: `${color ? color : '#25252530'}!important`
          }
        }}
      />
    </Box>
  )
}
