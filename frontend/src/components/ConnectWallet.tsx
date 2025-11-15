import { type Connector } from 'wagmi'

interface ConnectWalletProps {
  connectors: readonly Connector[]
  connect: (args: { connector: Connector }) => void
}

export function ConnectWallet({ connectors, connect }: ConnectWalletProps) {
  return (
    <div className="flex flex-col gap-3">
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Connect {connector.name}
        </button>
      ))}
    </div>
  )
}