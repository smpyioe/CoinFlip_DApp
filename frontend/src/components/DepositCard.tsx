import { useState } from 'react'
import { parseEther } from 'viem'
import { useWriteContract } from 'wagmi'
import { COINFLIP_ADDRESS, COINFLIP_ABI } from '../contracts'

interface DepositCardProps {
  balance: any
  isPending: boolean
  isConfirming: boolean
}

export function DepositCard({ balance, isPending, isConfirming }: DepositCardProps) {
  const [depositAmount, setDepositAmount] = useState('')
  const { writeContract } = useWriteContract()

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return
    
    writeContract({
      address: COINFLIP_ADDRESS,
      abi: COINFLIP_ABI,
      functionName: 'deposit',
      value: parseEther(depositAmount)
    })
    setDepositAmount('');
  }

  return (
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
          onClick={() => balance && setDepositAmount(parseFloat(balance.formatted).toFixed(4))}
          disabled={!balance}
          className="px-3 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
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
  )
}