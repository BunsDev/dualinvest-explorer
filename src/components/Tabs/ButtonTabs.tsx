import { ChangeEvent, useCallback } from 'react'
import { Tabs as MuiTabs, Tab } from '@mui/material'
import theme from 'theme'

export default function ButtonTabs({
  titles,
  current,
  onChange,
  width,
  height
}: {
  titles: string[] | JSX.Element[]
  current: number
  onChange: (val: number) => void
  width?: string
  height?: string
  // onChange?: ((event: SyntheticEvent<Element, Event>, value: any) => void
}) {
  const handleOnChange = useCallback(
    (e: ChangeEvent<any>, value: any) => {
      onChange(value)
    },
    [onChange]
  )

  return (
    <MuiTabs
      value={current}
      onChange={handleOnChange}
      sx={{
        '& .MuiTabs-flexContainer': {
          gap: 12,
          justifyContent: 'flex-start'
        },
        '& .MuiTabs-indicator': { display: 'none' }
      }}
      centered
    >
      {titles.map((tab, idx) => (
        <Tab
          disableRipple
          key={idx}
          label={tab}
          sx={{
            textTransform: 'none',
            padding: '0px 0px',
            fontSize: 16,
            fontWeight: 400,
            color: 'rgba(37, 37, 37, 0.5)',
            background: theme.palette.background.paper,
            border: '1px solid rgba(0, 0, 0, 0.1)',
            // border: '1px solid rgba(22, 22, 22, 0.1)',
            borderRadius: '6px',
            minHeight: height || 40,
            minWidth: width || 104,
            // height: '30px',
            '&.Mui-selected': {
              opacity: 1,
              border: '1px solid',
              borderColor: theme.palette.primary.main
            }
          }}
        />
      ))}
    </MuiTabs>
  )
}
