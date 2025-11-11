import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, anvil } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia, anvil],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [anvil.id]: http('http://127.0.0.1:8545'),
  },
})