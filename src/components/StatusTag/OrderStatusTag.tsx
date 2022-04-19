import { useCallback } from 'react'
import StatusTag from 'components/StatusTag'
import { OrderRecord } from 'utils/fetch/record'
import { InvestStatus } from 'hooks/useOrderData'
import useBreakpoint from 'hooks/useBreakpoint'

export default function OrderStatusTag({ order }: { order: OrderRecord }) {
  const isDownMd = useBreakpoint('md')
  const statusType = useCallback((order: OrderRecord) => {
    if ([InvestStatus.Ordered, InvestStatus.ReadyToSettle].includes(+order.investStatus)) {
      return 'pending'
    }
    if ([InvestStatus.OrderFailed, InvestStatus.EverythingFailed].includes(+order.status)) {
      return 'failed'
    }
    if (order.returnedCurrency === order.investCurrency) {
      return 'warning'
    }

    return 'success'
  }, [])

  const statusText = useCallback((order: OrderRecord) => {
    if ([InvestStatus.Ordered, InvestStatus.ReadyToSettle].includes(+order.investStatus)) {
      return 'Progressing'
    }
    if ([InvestStatus.OrderFailed, InvestStatus.EverythingFailed].includes(+order.status)) {
      return 'Failed'
    }
    if (order.investCurrency === order.returnedCurrency) {
      return 'Unexcercised'
    }
    return 'Exercised'
  }, [])

  return <StatusTag type={statusType(order)} text={statusText(order)} width={isDownMd ? '100%' : undefined} />
}
