import { farcasterFrame } from '@farcaster/frame-wagmi-connector'
import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'

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
