import { Select, MenuItem, InputBase } from '@mui/material'
import { inputBaseClasses } from '@mui/material/InputBase'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Divider from 'components/Divider'

export default function SelectInput({
  options,
  selected,
  value
}: {
  options: string[]
  selected?: string
  value: string
}) {
  return (
    <InputBase
      fullWidth
      sx={{
        [`&.${inputBaseClasses.root}`]: {
          fontSize: 16,
          borderRadius: 16,
          fontWeight: 400,
          color: theme => theme.palette.text.primary,
          backgroundColor: theme => theme.palette.background.default
        },
        '& .MuiInputBase-input': {
          paddingLeft: 20
        }
      }}
      value={value}
      placeholder="Search by Address/Order ID/Product ID"
      startAdornment={
        <>
          <Select
            value={selected}
            sx={{
              borderRadius: 16,
              border: 'none',
              width: 160,
              '& .MuiSelect-select': {
                padding: '12px 20px',
                fontSize: 16
              },
              '& .MuiSelect-icon': {
                color: 'rgba(0, 0, 0, 0.4)',
                right: '10px'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent'
              },
              '&.Mui-focused  .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent'
              }
            }}
            IconComponent={ExpandMoreIcon}
          >
            {options.map((option, idx) => (
              <MenuItem key={idx} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <Divider orientation="vertical" height={36} />
        </>
      }
    />
  )
}
