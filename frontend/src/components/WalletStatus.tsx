import { formatEther } from 'viem'

interface WalletStatusProps {
  address: `0x${string}` | undefined
  balance: any
  contractBalance: bigint | undefined
  refetch: () => void
  disconnect: () => void
}

export function WalletStatus({ address, balance, contractBalance, refetch, disconnect }: WalletStatusProps) {
  return (
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
            <p className="text-xs text-gray-400 mb-1">Wallet Balance</p>
            <p className="text-white font-semibold">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </p>
          </div>
        )}
        {contractBalance !== undefined && (
          <div className="border-t border-gray-700 pt-2">
            <p className="text-xs text-gray-400 mb-1">Contract Balance</p>
            <p className="text-green-400 font-semibold">
              {parseFloat(formatEther(contractBalance)).toFixed(4)} ETH
            </p>
            <button
              onClick={() => refetch()}
              className="mt-1 text-xs text-blue-400 hover:text-blue-300"
            >
              Refresh
            </button>
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
  )
}