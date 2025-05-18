import { farcasterFrame } from '@farcaster/frame-wagmi-connector'
import { http, createConfig } from 'wagmi'
import { defineChain } from 'viem/chains'

const base = defineChain({
  id: 8453,
  name: 'Base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://mainnet.base.org'] } },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://basescan.org' }
  }
})

export const config = createConfig({
  chains: [base],
  connectors: [farcasterFrame()],
  transports: {
    [base.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
