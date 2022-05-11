import { useState, useEffect, useMemo } from 'react'
import { Contract } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId } from 'constants/chain'
import { getOtherNetworkLibrary } from 'connectors/multiNetworkConnectors'
import { getContract, isAddress } from 'utils'
import { DEFI_VAULT_ADDRESS, SUPPORTED_DEFI_VAULT, ZERO_ADDRESS } from 'constants/index'
import DEFI_VAULT_ABI from '../constants/abis/defi_vault.json'
import DEFI_VAULT_OPTION_ABI from '../constants/abis/defi_vault_option.json'
import { useBlockNumber } from 'state/application/hooks'
import { parsePrecision } from 'utils/parseAmount'
import { trimNumberString } from 'utils/trimNumberString'

export interface DefiProduct {
  apy: string
  type: 'CALL' | 'PUT'
  expiredAt: number
  strikePrice: string
  currency: string
  investCurrency: string
  chainId: ChainId | undefined
  instantBalance?: string
  completeBalance?: string
  lockedBalance?: string
  cap?: number
  totalBalance?: number
  depositAmount?: string
  pricePerShareRaw?: string
  contractDecimals?: string
  currentOption?: string
}

enum DefiProductDataOrder {
  // accountVaultBalance,
  decimals,
  cap,
  totalBalance,
  // depositReceipts,
  vaultState,
  currentOption
}

const APY = '20%'

export function useDefiVaultList() {
  const list = useDefiVaultListBase()
  const [prices, setPrices] = useState<any[] | undefined>(undefined)

  useEffect(() => {
    if (!list) return
    Promise.all(
      list.map(item => {
        const library = item.chainId ? getOtherNetworkLibrary(item.chainId) : null
        return item.currentOption && library ? getStrikePrice(item.currentOption, library) : null
      })
    )
      .then(r => {
        setPrices(r)
      })
      .catch(error => {
        setPrices(undefined)
        console.error('failed to get strike prices', error)
      })
  }, [list])

  const res = useMemo(() => {
    if (!list) return undefined
    if (!prices) return list
    return list.map((item, index) => {
      item.strikePrice = prices[index]
      return item
    })
  }, [list, prices])

  return res
}

export function useDefiVaultListBase() {
  const [promise, setPromise] = useState<Promise<any> | undefined>(undefined)
  const [defiVaultList, setDefiVaultList] = useState<undefined | null | DefiProduct[]>(undefined)
  const blockNumber = useBlockNumber()

  useEffect(() => {
    const list = Object.keys(SUPPORTED_DEFI_VAULT).reduce((acc, chainId: string) => {
      const library = getOtherNetworkLibrary(+chainId)
      const addresses = DEFI_VAULT_ADDRESS[+chainId as ChainId]
      const list = SUPPORTED_DEFI_VAULT[+chainId as keyof typeof SUPPORTED_DEFI_VAULT]?.reduce(
        (acc, symbol: string) => {
          const addressCall = addresses?.[symbol]?.CALL
          const addressPut = addresses?.[symbol]?.PUT
          const contractCall = addressCall && library ? getContract(addressCall, DEFI_VAULT_ABI, library) : null
          const contractPut = addressPut && library ? getContract(addressPut, DEFI_VAULT_ABI, library) : null
          acc.push(callsFactory(contractCall))
          acc.push(callsFactory(contractPut))
          return acc
        },
        [] as any[]
      )
      acc.push(list ? Promise.all(list) : undefined)
      return acc
    }, [] as any[])
    setPromise(Promise.all(list))
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!promise) setDefiVaultList(defiVaultListUtil())
      try {
        const res = await promise
        const mappedRes = defiVaultListUtil(res)
        if (mounted) {
          setDefiVaultList(mappedRes)
        }
      } catch (e) {
        console.error(e)
        if (mounted) {
          setDefiVaultList(null)
        }
      }
    })()

    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promise, blockNumber])

  return defiVaultList
}

// defi list vault calls
const callsFactory = (contract: Contract | null) => {
  return Promise.all([
    contract?.decimals(),
    contract?.cap(),
    contract?.totalBalance(),
    contract?.vaultState(),
    contract?.currentOption()
  ])
}

const defiVaultListUtil = (res?: any[][]) => {
  return Object.keys(SUPPORTED_DEFI_VAULT).reduce((accMain, chainId: string, idx1: number) => {
    SUPPORTED_DEFI_VAULT[+chainId as keyof typeof SUPPORTED_DEFI_VAULT]?.map((symbol: string, idx2: number) => {
      const resCall = res?.[idx1][idx2 * 2]

      accMain.push({
        chainId: +chainId,
        currency: symbol,
        cap:
          resCall && resCall[DefiProductDataOrder.cap] && resCall[DefiProductDataOrder.decimals]
            ? +parsePrecision(resCall[DefiProductDataOrder.cap].toString(), resCall[DefiProductDataOrder.decimals])
            : 100,
        totalBalance:
          resCall && resCall[DefiProductDataOrder.totalBalance] && resCall[DefiProductDataOrder.decimals]
            ? +trimNumberString(
                parsePrecision(
                  resCall[DefiProductDataOrder.totalBalance].toString(),
                  resCall[DefiProductDataOrder.decimals]
                ),
                4
              )
            : 0,
        type: 'CALL',
        apy: APY,
        expiredAt: getExpireAt(),
        investCurrency: symbol,
        strikePrice: '-',
        currentOption: resCall && resCall[DefiProductDataOrder.currentOption]
      })

      const resPut = res?.[idx1][idx2 * 2 + 1]

      accMain.push({
        chainId: +chainId,
        currency: symbol,
        cap:
          resPut && resPut[DefiProductDataOrder.cap] && resPut[DefiProductDataOrder.decimals]
            ? +parsePrecision(resPut[DefiProductDataOrder.cap].toString(), resPut[DefiProductDataOrder.decimals])
            : 100,
        totalBalance:
          resPut && resPut[DefiProductDataOrder.totalBalance] && resPut[DefiProductDataOrder.decimals]
            ? +trimNumberString(
                parsePrecision(
                  resPut[DefiProductDataOrder.totalBalance].toString(),
                  resPut[DefiProductDataOrder.decimals]
                ),
                4
              )
            : 0,
        type: 'PUT',
        apy: APY,
        expiredAt: getExpireAt(),
        investCurrency: 'USDC',
        strikePrice: '-',
        currentOption: resPut && resPut[DefiProductDataOrder.currentOption]
      })
    })

    return accMain
  }, [] as DefiProduct[])
}

const getStrikePrice = async (contractAddress: string | undefined, library: Web3Provider | undefined) => {
  if (!contractAddress || !library || !isAddress(contractAddress) || contractAddress === ZERO_ADDRESS) return '-'
  try {
    const contract = getContract(contractAddress, DEFI_VAULT_OPTION_ABI, library)
    const price = await contract?.strikePrice()
    const decimals = await contract?.decimals()
    return parsePrecision(price.toString(), decimals)
  } catch (e) {
    console.error(e)
    return '-'
  }
}

const getExpireAt = () => {
  const now = new Date(Date.now())
  const UTCh = now.getUTCHours()
  const displacement = (5 + 7 - now.getUTCDay()) % 7
  const fridayDate = now.getUTCDate() + (displacement === 0 && UTCh >= 8 ? 7 : displacement)
  now.setUTCDate(fridayDate)
  now.setUTCHours(8, 0, 0)
  return now.getTime()
}
