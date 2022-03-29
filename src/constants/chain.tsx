import { Chain } from 'models/chain'
// import { ReactComponent as ETH } from 'assets/svg/eth_logo.svg'
// import EthUrl from 'assets/svg/eth_logo.svg'
import BSCUrl from 'assets/svg/bsc_logo.svg'
import { ReactComponent as BSC } from 'assets/svg/binance.svg'
import { ReactComponent as AVAX } from 'assets/svg/avax.svg'
import AVAXUrl from 'assets/svg/avax.svg'

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  BSC = 56,
  AVAX = 43114
}

export const NETWORK_CHAIN_ID: ChainId = process.env.REACT_APP_CHAIN_ID
  ? parseInt(process.env.REACT_APP_CHAIN_ID)
  : ChainId.BSC

export const IS_TEST_NET = !!(NETWORK_CHAIN_ID === ChainId.ROPSTEN)

export const SUPPORTED_CHAINS: {
  [key: string]: {
    icon: JSX.Element
    logo: string
    symbol: string
    name: string
    id: number
    hex: string
  }
} = {
  BSC: {
    icon: <BSC height={20} width={20} />,
    logo: BSCUrl,
    symbol: 'BNB',
    name: 'Binance Smart Chain',
    id: ChainId.BSC,
    hex: '0x38'
  },
  AVAX: { icon: <AVAX />, logo: AVAXUrl, symbol: 'AVAX', name: 'Avalanche', id: ChainId.AVAX, hex: '0xA86A' }
}

export const ChainList = [
  {
    icon: <BSC height={20} width={20} />,
    logo: BSCUrl,
    symbol: 'BNB',
    name: 'Binance Smart Chain',
    id: ChainId.BSC,
    hex: '0x38'
  },
  {
    icon: <AVAX />,
    logo: AVAXUrl,
    symbol: 'AVAX',
    name: 'Avalanche',
    id: ChainId.AVAX,
    hex: '0xA86A'
  }
]

export const ChainListMap: {
  [key: number]: { icon: JSX.Element; link?: string; selectedIcon?: JSX.Element } & Chain
} = ChainList.reduce((acc, item) => {
  acc[item.id] = item
  return acc
}, {} as any)

export const SUPPORTED_NETWORKS: {
  [chainId in ChainId]?: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com']
  },
  [ChainId.ROPSTEN]: {
    chainId: '0x3',
    chainName: 'Ropsten',
    nativeCurrency: {
      name: 'Ropsten',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://ropsten.infura.io/v3/'],
    blockExplorerUrls: ['https://ropsten.etherscan.io/']
  },
  [ChainId.RINKEBY]: {
    chainId: '0x4',
    chainName: 'Rinkeby',
    nativeCurrency: {
      name: 'Rinkeby',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://rinkeby.infura.io/v3/'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io/']
  },
  [ChainId.KOVAN]: {
    chainId: '0x2a',
    chainName: 'Kovan',
    nativeCurrency: {
      name: 'Kovan',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://kovan.infura.io/v3/'],
    blockExplorerUrls: ['https://kovan.etherscan.io/']
  },
  [ChainId.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  [ChainId.AVAX]: {
    chainId: '0xA86A',
    chainName: 'Avalanche',
    nativeCurrency: {
      name: 'Avalanche Token',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://cchain.explorer.avax.network']
  }
}
