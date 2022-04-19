import { Typography, Box } from '@mui/material'
import Tag from 'components/Tag'

export default function FilteredBy({ data = {} }: { data: { [key: string]: string } }) {
  return (
    <Box display="flex" flexDirection="column" padding={'10px 0'}>
      <>
        <Typography fontSize={16} fontWeight={500}>
          {' '}
          Filtered by Order Holder, Order ID
        </Typography>
      </>
      <Box display="flex" flexDirection="row" paddingTop={'20px'} gap={12}>
        {Object.keys(data).map((key, idx) => (
          <Box key={idx} display="flex" justifyContent={'flex-start'}>
            <Tag text={key + ' ' + data[key as keyof typeof data]} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
