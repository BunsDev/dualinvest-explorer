import { useState, useMemo } from 'react'
import dayjs from 'dayjs'
import { Box, Typography, useTheme } from '@mui/material'
import PaginationView from 'components/Pagination'
import ButtonTabs from 'components/Tabs/ButtonTabs'
import useBreakpoint from 'hooks/useBreakpoint'
import { useHistoryRecords } from 'hooks/useDovHistoryRecords'
import Table from 'components/Table'
import { ChainListMap } from 'constants/chain'
import { SUPPORTED_DEFI_VAULT } from 'constants/index'
import { DefiRecord } from 'utils/fetch/defiRecord'
import NoDataCard from 'components/Card/NoDataCard'
import TransactionTypeIcon from 'components/Icon/TransactionTypeIcon'
import { shortenAddress } from 'utils'
import { SUPPORTED_CURRENCIES } from 'constants/currencies'
import Image from 'components/Image'
import { Link } from 'react-router-dom'
import { routes } from 'constants/routes'
import { Loader } from 'components/AnimatedSvg/Loader'

const chains = Object.keys(SUPPORTED_DEFI_VAULT)

const ActivitiesTableHeader = ['Address', 'Type', 'Vault', 'Amount', 'Date']

export function DovVault({ account }: { account?: string }) {
  const [page, setPage] = useState(1)

  const [chain, setChain] = useState(0)

  const isDownMd = useBreakpoint('md')
  const theme = useTheme()
  const { pageParams, orderList } = useHistoryRecords(page, account ?? undefined, +chains[chain])

  const activitiesRow = useMemo(() => {
    if (!orderList) return []
    return orderList.map((record: DefiRecord) => {
      return [
        shortenAddress(record.account),
        <TransactionTypeIcon key="type" txType={record.actionType} />,
        record.currency ? (
          <Link
            style={{ color: theme.palette.text.primary }}
            to={routes.explorerProduct.replace(':productId', 'vault')}
          >
            {`${record.currency} ${record.callPut === 'CALL' ? 'Upward' : 'Downward'}`}
          </Link>
        ) : (
          '--'
        ),
        record.amount ? (
          <Box display={'flex'} alignItems="center" gap="5px">
            <Image src={SUPPORTED_CURRENCIES[record.investCurrency]?.logoUrl} style={{ width: 20, height: 20 }} />
            <Typography>{record.amount + ' ' + record.investCurrency}</Typography>
          </Box>
        ) : (
          '--'
        ),
        (dayjs(record.timestamp) as any).utc().format('MMM DD, YYYY hh:mm A') + ' UTC'
      ]
    })
  }, [orderList, theme.palette.text.primary])

  return (
    <Box padding={isDownMd ? '16px 0' : '24px 0'}>
      <ButtonTabs
        width="max-content"
        titles={Object.keys(SUPPORTED_DEFI_VAULT).map(id => (
          <Box
            key={id}
            padding="0 10px"
            gap={5}
            display="flex"
            alignItems={'center'}
            sx={{
              '& svg': {
                height: 22,
                width: 22
              }
            }}
          >
            {ChainListMap[+id].icon}
            {ChainListMap[+id].name}
          </Box>
        ))}
        current={chain}
        onChange={setChain}
      />
      <Table fontSize="16px" header={ActivitiesTableHeader} rows={activitiesRow} />
      {orderList?.length === 0 && <NoDataCard />}
      {!orderList && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            width: '100%',
            height: 350,
            zIndex: 3
          }}
        >
          <Loader />
        </Box>
      )}

      <PaginationView
        count={pageParams?.count}
        page={page}
        perPage={pageParams?.perPage}
        boundaryCount={0}
        total={pageParams?.total}
        onChange={(event, value) => setPage(value)}
      />
    </Box>
  )
}
