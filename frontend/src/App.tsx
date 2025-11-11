import { useAccount, useConnect, useDisconnect, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { anvil } from 'wagmi/chains'
import { formatEther, parseEther } from 'viem'
import { useState } from 'react'
import { COINFLIP_ADDRESS, COINFLIP_ABI } from './contracts'

function App() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ 
    address,
    chainId: anvil.id 
  })

  const [depositAmount, setDepositAmount] = useState('')

  const { data: contractBalance, refetch } = useReadContract({
    address: COINFLIP_ADDRESS,
    abi: COINFLIP_ABI,
    functionName: 'getBalance',
    args: address ? [address] : undefined,
  })

  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  if (isSuccess) {
    refetch()
  }

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return
    
    writeContract({
      address: COINFLIP_ADDRESS,
      abi: COINFLIP_ABI,
      functionName: 'deposit',
      value: parseEther(depositAmount),
    })
  }

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
      )}

      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-5xl font-bold text-white mb-4">
          Coin Flip Game
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Test your luck on the blockchain
        </p>

        {!isConnected ? (
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
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Deposit ETH</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Amount (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleDeposit}
                disabled={isPending || isConfirming || !depositAmount}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {isPending || isConfirming ? 'Processing...' : 'Deposit'}
              </button>
              {isSuccess && (
                <p className="text-green-400 text-sm text-center">
                  ✓ Deposit successful!
                </p>
              )}
              {hash && (
                <p className="text-gray-400 text-xs text-center break-all">
                  Tx: {hash}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App