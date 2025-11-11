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
  const [withdrawAmount, setwithdrawAmount] = useState('')
  const [flipAmount, setFlipAmount] = useState('')
  const [guess, setGuess] = useState<0 | 1>(0) 

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
    setDepositAmount('');
  }


  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return
    
    writeContract({
      address: COINFLIP_ADDRESS,
      abi: COINFLIP_ABI,
      functionName: 'withdraw',
      args: [parseEther(withdrawAmount)],
    })
    setwithdrawAmount('');
  }

  const handleFlip = () => {
    if (!flipAmount || parseFloat(flipAmount) <= 0) return
    
    writeContract({
      address: COINFLIP_ADDRESS,
      abi: COINFLIP_ABI,
      functionName: 'flip',
      args: [guess, parseEther(flipAmount)],
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

      {isConnected && (
        <div className="absolute top-4 left-4 flex flex-col gap-4 w-80">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-3">Deposit</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Amount (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
                <button
                onClick={() => setDepositAmount(parseFloat(balance.formatted).toFixed(4))}
                >
                  Max
                </button>
              <button
                onClick={handleDeposit}
                disabled={isPending || isConfirming || !depositAmount}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {isPending || isConfirming ? 'Processing...' : 'Deposit'}
              </button>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-3">Withdraw</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Amount (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.0"
                  value={withdrawAmount}
                  onChange={(e) => setwithdrawAmount(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                <button
                onClick={() => setwithdrawAmount(parseFloat(formatEther(contractBalance)).toFixed(4))}
                >
                  Max
                </button>
              </div>
              <button
                onClick={handleWithdraw}
                disabled={isPending || isConfirming || !withdrawAmount}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {isPending || isConfirming ? 'Processing...' : 'Withdraw'}
              </button>
            </div>
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
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 w-full max-w-lg">
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl transform hover:rotate-180 transition-transform duration-500">
                <span className="text-4xl font-bold text-gray-900">
                  {guess === 0 ? '👑' : '🦅'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Choose Side</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setGuess(0)}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      guess === 0
                        ? 'bg-purple-600 text-white border-2 border-purple-400'
                        : 'bg-gray-700 text-gray-300 border-2 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    👑 Heads
                  </button>
                  <button
                    onClick={() => setGuess(1)}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      guess === 1
                        ? 'bg-purple-600 text-white border-2 border-purple-400'
                        : 'bg-gray-700 text-gray-300 border-2 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    🦅 Tails
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Bet Amount: <span className="text-white font-semibold">{flipAmount || '0'} ETH</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max={contractBalance ? parseFloat(formatEther(contractBalance)) : 1}
                  step="0.01"
                  value={flipAmount}
                  onChange={(e) => setFlipAmount(e.target.value)}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 ETH</span>
                  <span>{contractBalance ? parseFloat(formatEther(contractBalance)).toFixed(2) : '0'} ETH</span>
                </div>
              </div>

              <button
                onClick={handleFlip}
                disabled={isPending || isConfirming || !flipAmount || parseFloat(flipAmount) <= 0}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white text-xl font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                {isPending || isConfirming ? ' Flipping...' : ' FLIP COIN!'}
              </button>

              {isSuccess && (
                <div className="bg-green-900/50 border border-green-500 rounded-lg p-3">
                  <p className="text-green-400 text-sm text-center">
                    ✓ Transaction successful!
                  </p>
                </div>
              )}
              {hash && (
                <p className="text-gray-400 text-xs text-center break-all">
                  Tx: {hash.slice(0, 10)}...{hash.slice(-8)}
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