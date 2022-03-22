import { useState, useCallback } from 'react'
import { Axios } from 'utils/axios'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'

interface Stat {
  TotalNamberOfOders: number
  CumulativeInvestmentAmount: string
  CumulativeNamberOUsers: number
}

export function useStatistical() {
  const [stat, setStat] = useState<Stat | undefined>(undefined)

  const promiseFn = useCallback(() => Axios.get('expolerStatistical'), [])
  const callbackFn = useCallback(r => setStat(r.data.data), [])

  usePollingWithMaxRetries(promiseFn, callbackFn)

  return stat
}
