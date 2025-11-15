import { useState } from 'react'
import { formatEther, parseEther } from 'viem'
import { useWriteContract } from 'wagmi'
import { COINFLIP_ADDRESS, COINFLIP_ABI } from '../contracts'

interface WithdrawCardProps {
  contractBalance: bigint | undefined
  isPending: boolean
  isConfirming: boolean
}

export function WithdrawCard({ contractBalance, isPending, isConfirming }: WithdrawCardProps) {
  const [withdrawAmount, setwithdrawAmount] = useState('')
  const { writeContract } = useWriteContract()

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return
    
    writeContract({
      address: COINFLIP_ADDRESS,
      abi: COINFLIP_ABI,
      functionName: 'withdraw',
      args: [parseEther(withdrawAmount)],
    })
    setwithdrawAmount('')
  }

  return (
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
        </div>
        <button
          onClick={() => contractBalance && setwithdrawAmount(parseFloat(formatEther(contractBalance)).toFixed(4))}
          disabled={!contractBalance}
          className="px-3 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Max
        </button>
        <button
          onClick={handleWithdraw}
          disabled={isPending || isConfirming || !withdrawAmount}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          {isPending || isConfirming ? 'Processing...' : 'Withdraw'}
        </button>
      </div>
    </div>
  )
}