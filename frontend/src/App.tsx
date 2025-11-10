import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { sepolia } from 'wagmi/chains'


function App() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ 
    address,
    chainId: sepolia.id 
  })

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {isConnected && (
        <div className="absolute top-4 right-4 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Connected</span>
            </div>
            <div className="border-t border-gray-700 pt-2">
              <p className="text-xs text-gray-400 mb-1">Address</p>
              <p className="text-white font-mono text-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
            {balance && (
              <div className="border-t border-gray-700 pt-2">
                <p className="text-xs text-gray-400 mb-1">Balance</p>
                <p className="text-white font-semibold">
                  {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                </p>
              </div>
            )}
            <button
              onClick={() => disconnect()}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-5xl font-bold text-white mb-4">
          Coin Flip Game
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Test your luck on the blockchain
        </p>

        {!isConnected && (
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
        )}
      </div>
    </div>
  )
}

export default App
