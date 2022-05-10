import { useMemo } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import dayjs from 'dayjs'
import dayjsPluginUTC from 'dayjs-plugin-utc'
import NoDataCard from 'components/Card/NoDataCard'
import Table from 'components/Table'
import { DEFI_OPTION_VAULT_LINK, DUAL_INVESTMENT_LINK, RECURRING_STRATEGY_LINK } from 'constants/links'
import useBreakpoint from 'hooks/useBreakpoint'
import { INVEST_TYPE, useDovOrderRecords, useOrderRecords } from 'hooks/useOrderData'
import { ExternalLink } from 'theme/components'
import { shortenAddress } from 'utils'
import { SUPPORTED_NETWORKS } from 'constants/chain'
import Image from 'components/Image'
import { SUPPORTED_CURRENCIES } from 'constants/currencies'
import { Loader } from 'components/AnimatedSvg/Loader'

dayjs.extend(dayjsPluginUTC)

const orderListArgs = { pageNum: 0, pageSize: 5 }
const dovOrderListArgs = { pageSize: 5 }

const TableHeader = [
  'Product Type',
  'Chain',
  'Time',
  'Address',
  'Product ID',
  'Order ID',
  // 'Token',
  'Exercise',
  'APY',
  'Amount of Investing',
  ''
]

export default function RecentTransaction() {
  const { orderList } = useOrderRecords(orderListArgs)
  const { dovOrderList } = useDovOrderRecords(dovOrderListArgs)

  const theme = useTheme()
  const isDownMd = useBreakpoint('md')

  const dataRows = useMemo(() => {
    if (!orderList || !dovOrderList) return []
    const diList = orderList
      ? orderList.map(product => {
          const multiplier = product.type === 'CALL' ? 1 : +product.strikePrice
          const network = SUPPORTED_NETWORKS[+product.chainId as keyof typeof SUPPORTED_NETWORKS]
          return [
            <ExternalLink
              key={0}
              style={{
                color: theme.palette.text.primary,
                textDecorationColor: theme.palette.text.primary,
                fontSize: isDownMd ? 16 : undefined,
                fontWeight: isDownMd ? 400 : undefined,
                display: 'block',
                marginBottom: isDownMd ? '10px' : undefined
              }}
              href={product.investType === INVEST_TYPE.recur ? RECURRING_STRATEGY_LINK : DUAL_INVESTMENT_LINK}
              underline="always"
            >
              {product.investType === INVEST_TYPE.recur ? 'Recurring Strategy' : 'Dual Investment'}
            </ExternalLink>,
            <Box display="flex" key={product.orderId} alignItems="center" gap={5}>
              {network ? (
                <Image
                  src={SUPPORTED_CURRENCIES[network?.nativeCurrency.symbol]?.logoUrl}
                  style={{ width: 20, height: 20, display: 'block' }}
                ></Image>
              ) : null}
              <Typography style={{ fontSize: '12px' }}>{network?.chainName}</Typography>
            </Box>,
            +product.ts * 1000,
            <Typography style={{ fontSize: '12px' }} key={product.orderId}>
              {shortenAddress(product.address)}
            </Typography>,

            product.productId,
            product.orderId,
            // product.investCurrency,
            product.type === 'CALL' ? 'Upward' : 'Downward',
            (+product.annualRor * 100).toFixed(2) + '%',
            (+product.amount * +product.multiplier * multiplier).toFixed(2) + ' ' + product.investCurrency
          ]
        })
      : []
    const dovList = dovOrderList
      ? dovOrderList.map(product => {
          const multiplier = product.type === 'CALL' ? 1 : +product.strikePrice
          const network = SUPPORTED_NETWORKS[+product.chainId as keyof typeof SUPPORTED_NETWORKS]
          return [
            <ExternalLink
              key={0}
              style={{
                color: theme.palette.text.primary,
                textDecorationColor: theme.palette.text.primary,
                fontSize: isDownMd ? 16 : undefined,
                fontWeight: isDownMd ? 400 : undefined,
                display: 'block',
                marginBottom: isDownMd ? '10px' : undefined
              }}
              href={DEFI_OPTION_VAULT_LINK}
              underline="always"
            >
              Defi Option Vault
            </ExternalLink>,
            <Box display="flex" key={product.orderId} alignItems="center" gap={5}>
              {network ? (
                <Image
                  src={SUPPORTED_CURRENCIES[network?.nativeCurrency.symbol]?.logoUrl}
                  style={{ width: 24, height: 24, display: 'block' }}
                ></Image>
              ) : null}
              <Typography style={{ fontSize: '12px' }}>{network?.chainName}</Typography>
            </Box>,
            +product.createdAt,
            // (dayjs(+product.createdAt) as any).utc().format('MMM DD, YYYY hh:mm A') + ' UTC',
            '--',

            'Vault',
            product.orderId,
            // 'currency',
            product.type === 'CALL' ? 'Upward' : 'Downward',
            (+product.annualRor * 100).toFixed(2) + '%',
            (+product.amount * +product.multiplier * multiplier).toFixed(2) + ' ' + product.investCurrency
          ]
        })
      : []
    return dovList
      ? (diList as any[])
          .concat(dovList)
          .sort((a, b) => b[2] - a[2])
          .map(item => {
            item[2] = (
              <Typography style={{ fontSize: '12px' }}>
                {(dayjs(item[2]) as any).utc().format('MMM DD, YYYY \nhh:mm A') + ' UTC'}
              </Typography>
            )
            return item
          })
      : []
  }, [dovOrderList, isDownMd, orderList, theme.palette.text.primary])

  return (
    <>
      <Table fontSize="16px" header={TableHeader} rows={dataRows} />
      {!orderList || (!dovOrderList && <Loader margin="40px auto 0" />)}
      {orderList?.length === 0 && dovOrderList?.length === 0 && <NoDataCard text={'No data'} />}
    </>
  )
}
