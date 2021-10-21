import { MenuItem } from '@material-ui/core'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Select from 'components/Select/Select'

export default {
  title: 'Input/Select',
  component: Select
} as ComponentMeta<typeof Select>

const DefaultTemplate: ComponentStory<typeof Select> = args => (
  <Select {...args} placeholder="select">
    <MenuItem key={'ETH'} value={'ETH'}>
      ETH
    </MenuItem>
    <MenuItem key={'BSC'} value={'BSC'}>
      BSC
    </MenuItem>
  </Select>
)

export const Default = DefaultTemplate.bind({})