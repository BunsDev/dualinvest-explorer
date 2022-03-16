import { Typography } from '@mui/material'
import { Box } from '@mui/system'

export default function FilteredBy({ data = {} }: { data: { [key: string]: string } }) {
  return (
    <Box display="flex" flexDirection="column" padding={'10px 24px'}>
      <>
        <Typography fontSize={16}> Filtered by Order Holder, Order ID</Typography>
      </>
      <Box display="flex" flexDirection="row" paddingTop={'20px'}>
        {Object.keys(data).map((key, idx) => (
          <Box key={idx} display="flex" justifyContent={'flex-start'}>
            <FilterTag text={key + ' ' + data[key as keyof typeof data]} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

interface Props {
  text: string
}

function FilterTag(props: Props) {
  const { text } = props
  return (
    <Box
      component="span"
      borderRadius={22}
      sx={{ border: '1px solid transparent' }}
      color={'#11BF2D'}
      bgcolor={'rgba(17, 191, 45, 0.1)'}
      fontSize={14}
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={28}
      fontWeight={400}
      marginRight={'12px'}
    >
      <Typography padding={'0px 12px 0px 12px'}>{text}</Typography>
    </Box>
  )
}
