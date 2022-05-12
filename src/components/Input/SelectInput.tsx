import { ChangeEvent, useCallback, useMemo } from 'react'
import { Select, MenuItem, InputBase } from '@mui/material'
import { inputBaseClasses } from '@mui/material/InputBase'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Divider from 'components/Divider'
import useBreakpoint from 'hooks/useBreakpoint'

export default function SelectInput({
  options,
  selected,
  value,
  onChangeSelect,
  onChangeInput,
  placeholder,
  onSearch
}: {
  options: string[]
  selected?: string
  value: string
  placeholder: string
  onChangeSelect?: (e: any) => void
  onChangeInput?: (e: ChangeEvent<HTMLInputElement>) => void
  onSearch?: () => void
}) {
  const isDownSm = useBreakpoint('sm')

  const handleSelectChange = useCallback(
    e => {
      const value = options.find(option => option === e.target.value) ?? null
      onChangeSelect && onChangeSelect(value)
    },
    [options, onChangeSelect]
  )

  const selectEl: JSX.Element = useMemo(
    () => (
      <Select
        value={selected}
        sx={{
          border: 'none',
          width: { xs: '100%', sm: 160 },
          overflow: 'hidden',
          '& .MuiSelect-select': {
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            fontSize: 16,
            boxSizing: 'border-box',
            height: '60px!important',
            backgroundColor: theme => theme.palette.background.default
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
        onChange={handleSelectChange}
      >
        {options.map((option, idx) => (
          <MenuItem key={idx} value={option} selected={selected === option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    ),
    [handleSelectChange, options, selected]
  )

  return (
    <>
      {isDownSm && selectEl}
      <InputBase
        onChange={onChangeInput}
        onKeyDown={e => {
          const key = e.key
          if (key === 'Enter') {
            onSearch && onSearch()
          }
        }}
        fullWidth
        sx={{
          [`&.${inputBaseClasses.root}`]: {
            fontSize: 16,
            borderRadius: '10px',
            fontWeight: 400,
            height: '60px',
            color: theme => theme.palette.text.primary,
            backgroundColor: theme => theme.palette.background.default
          },
          '& .MuiInputBase-input': {
            paddingLeft: 20
          }
        }}
        value={value}
        placeholder={placeholder}
        startAdornment={
          isDownSm ? null : (
            <>
              {selectEl} <Divider orientation="vertical" height={36} />
            </>
          )
        }
      />
    </>
  )
}
