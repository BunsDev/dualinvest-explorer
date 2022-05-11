import { useState, useMemo } from 'react'
import dayjs from 'dayjs'
import { Box, Typography } from '@mui/material'
// import FilteredBy from 'components/FilteredBy'
import { PageLayout } from 'components/PageLayout'
import PaginationView from 'components/Pagination'
// import Table from 'components/Table'
import ButtonTabs from 'components/Tabs/ButtonTabs'
import useBreakpoint from 'hooks/useBreakpoint'
import { useHistoryRecords } from 'hooks/useDovHistoryRecords'
import Tag from 'components/Tag'
import FilteredBy from 'components/FilteredBy'
import { useDefiVaultList } from 'hooks/useDefiVault'
import Table from 'components/Table'

import StatusTag from 'components/StatusTag'
import { ExternalLink } from 'theme/components'
import Button from 'components/Button/Button'
import { DEFI_OPTION_MGMT_LINK } from 'constants/links'
import { ChainListMap, SUPPORTED_NETWORKS } from 'constants/chain'
import { SUPPORTED_DEFI_VAULT } from 'constants/index'
import { DefiRecord } from 'utils/fetch/defiRecord'
import NoDataCard from 'components/Card/NoDataCard'
import TransactionTypeIcon from 'components/Icon/TransactionTypeIcon'
import { shortenAddress } from 'utils'
import { SUPPORTED_CURRENCIES } from 'constants/currencies'
import Image from 'components/Image'

enum TableOptions {
  Details,
  Activities
}
const tableTabs = ['Details', 'Activities']

const filterBy = { ['Product ID:']: 'Vault' }

const chains = Object.keys(SUPPORTED_DEFI_VAULT)

const ActivitiesTableHeader = ['Address', 'Type', 'Vault', 'Amount', 'Date']

const DetailsTableHeader = ['Token', 'Approximate APY', 'Delivery Date', 'Strike Price', 'Exercise', '', '']

export function DovVault() {
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState(TableOptions.Details)
  const [chain, setChain] = useState(0)

  const isDownMd = useBreakpoint('md')
  const { pageParams, orderList } = useHistoryRecords(page, undefined, +chains[chain])
  const dovList = useDefiVaultList()

  const data = useMemo(() => {
    // const totalInvestAmount = sum

    return {
      ['Type:']: (
        <Box display="flex" gap={12} alignItems="center">
          <Tag text={'Defi Option Vault'} />
        </Box>
      )
      // ['Total Invest Amount:']: totalInvestAmount.toFixed(2) + ' USDT',
      // ['Positions:']: positions
    }
  }, [])

  const detailsRow = useMemo(() => {
    if (!dovList) return []
    return dovList.map(item => {
      const progressing = Date.now() < item.expiredAt
      return [
        <Box key={0} display="flex" alignItems={'center'} gap={8} sx={{ '& svg': { width: 22, height: 22 } }}>
          {item.chainId && ChainListMap[item.chainId].icon}
          <Box display="grid">
            {item.currency}
            <Typography sx={{ color: theme => theme.palette.text.secondary, fontSize: '12px!important' }}>
              {item.chainId ? SUPPORTED_NETWORKS[item.chainId]?.chainName : null}
            </Typography>
          </Box>
        </Box>,
        item.apy,
        (dayjs(item.expiredAt) as any).utc().format('MMM DD, YYYY hh:mm A') + ' UTC',
        item.strikePrice ? item.strikePrice + ' USDC' : '--',
        item.type === 'CALL' ? 'Upward' : 'Downward',
        <StatusTag
          key=""
          type={progressing ? 'pending' : 'success'}
          text={progressing ? 'Progressing' : 'Finished'}
          width={isDownMd ? '100%' : undefined}
        />,
        <ExternalLink
          href={DEFI_OPTION_MGMT_LINK.replace(
            ':chainName/:currency/:type',
            `${item.chainId ? ChainListMap[+item.chainId].symbol : 'ETH'}/${item.currency}/${item.type}`
          )}
          key={0}
          style={{
            width: isDownMd ? '100%' : '120px'
          }}
        >
          <Button height="36px" width="100%" style={{ borderRadius: 50, fontSize: 14, marginLeft: 'auto' }}>
            Start now
          </Button>
        </ExternalLink>
      ]
    })
  }, [dovList, isDownMd])

  const activitiesRow = useMemo(() => {
    if (!orderList) return []
    return orderList.map((record: DefiRecord) => {
      return [
        shortenAddress(record.account),
        <TransactionTypeIcon key="type" txType={record.actionType} />,
        record.currency ? `${record.currency} ${record.callPut === 'CALL' ? 'Upward' : 'Downward'}` : '--',
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
  }, [orderList])

  return (
    <PageLayout
      backLink="/account"
      data={data}
      titleHead={
        <>
          <Box display="flex" flexDirection="column">
            <Typography sx={{ opacity: '0.5' }} fontSize={16}>
              Product ID
            </Typography>
            <Typography fontWeight={'700'} fontSize={'24px'} mt={6}>
              #Vault
            </Typography>
          </Box>
        </>
      }
    >
      <Box>
        <FilteredBy data={filterBy} />{' '}
      </Box>
      <Box paddingTop={isDownMd ? '29px' : '45px'}>
        <ButtonTabs titles={tableTabs} current={tab} onChange={setTab} />
      </Box>
      <Box padding={isDownMd ? '16px 0' : '24px 0'}>
        {tab == TableOptions.Details && <Table fontSize="16px" header={DetailsTableHeader} rows={detailsRow} />}
        {tab == TableOptions.Activities && (
          <>
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
          </>
        )}
        {tab !== TableOptions.Activities && (
          <PaginationView
            count={pageParams?.count}
            page={page}
            perPage={pageParams?.perPage}
            boundaryCount={0}
            total={pageParams?.total}
            onChange={(event, value) => setPage(value)}
          />
        )}
      </Box>
    </PageLayout>
  )
}
