import { useState } from 'react'
import { formatEther, parseEther } from 'viem'
import { useWriteContract } from 'wagmi'
import { COINFLIP_ADDRESS, COINFLIP_ABI } from '../contracts'

interface CoinFlipGameProps {
  contractBalance: bigint | undefined
  isPending: boolean
  isConfirming: boolean
  isSuccess: boolean
  hash: `0x${string}` | undefined
}

export function CoinFlipGame({ contractBalance, isPending, isConfirming, isSuccess, hash }: CoinFlipGameProps) {
  const [flipAmount, setFlipAmount] = useState('0')
  const [guess, setGuess] = useState<0 | 1>(0)
  const { writeContract } = useWriteContract()

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
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 w-full max-w-lg">
      <div className="flex justify-center mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl transform hover:rotate-180 transition-transform duration-500">
          <span className="text-4xl font-bold text-gray-900">
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
              Heads
            </button>
            <button
              onClick={() => setGuess(1)}
              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                guess === 1
                  ? 'bg-purple-600 text-white border-2 border-purple-400'
                  : 'bg-gray-700 text-gray-300 border-2 border-gray-600 hover:bg-gray-600'
              }`}
            >
              Tails
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
            max={contractBalance ? parseFloat(formatEther(contractBalance)) : 0}
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
  )
}