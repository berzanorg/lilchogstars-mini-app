import { farcasterFrame } from '@farcaster/frame-wagmi-connector'
import { http, createConfig } from 'wagmi'
import { monadTestnet } from 'wagmi/chains'

export const config = createConfig({
  chains: [monadTestnet],
  connectors: [farcasterFrame()],
  transports: {
    [monadTestnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
