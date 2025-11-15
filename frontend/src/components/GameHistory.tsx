import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import { anvil } from 'wagmi/chains'
import { formatEther } from 'viem'
import { COINFLIP_ADDRESS } from '../contracts'

interface GameLog {
  player: string
  win: boolean
  guess: number
  amount: bigint
  blockNumber: bigint
  transactionHash: string
}

export function GameHistory() {
  const [logs, setLogs] = useState<GameLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const publicClient = usePublicClient({ chainId: anvil.id })

  useEffect(() => {
    const fetchLogs = async () => {
      if (!publicClient) return
      
      try {
        setIsLoading(true)
        const gameLogs = await publicClient.getLogs({
          address: COINFLIP_ADDRESS,
          event: {
            type: 'event',
            name: 'GameResult',
            inputs: [
              { type: 'address', name: 'player', indexed: false },
              { type: 'bool', name: 'win', indexed: false },
              { type: 'uint8', name: 'guess', indexed: false },
              { type: 'uint256', name: 'amount', indexed: false }
            ]
          },
          fromBlock: 0n,
          toBlock: 'latest'
        })

        const parsedLogs = gameLogs.map((log: any) => ({
          player: log.args.player as string,
          win: log.args.win as boolean,
          guess: log.args.guess as number,
          amount: log.args.amount as bigint,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash
        }))

        setLogs(parsedLogs.reverse())
      } catch (error) {
        console.error('Error fetching logs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [publicClient])

  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-3">Game History</h3>
        <p className="text-gray-400 text-sm text-center">Loading...</p>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-3">Game History</h3>
        <p className="text-gray-400 text-sm text-center">No games played yet</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-3">
        Game History ({logs.length} games)
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {logs.map((log, index) => (
          <div
            key={`${log.transactionHash}-${index}`}
            className={`p-3 rounded-lg border ${
              log.win
                ? 'bg-green-900/30 border-green-500'
                : 'bg-red-900/30 border-red-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-300">
                  {log.guess === 0 ? 'Heads' : 'Tails'}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {parseFloat(formatEther(log.amount)).toFixed(4)} ETH
                </span>
              </div>
              <span className={`font-bold text-lg ${log.win ? 'text-green-400' : 'text-red-400'}`}>
                {log.win ? 'WIN' : 'LOSE'}
              </span>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                Player: <span className="font-mono">{log.player.slice(0, 6)}...{log.player.slice(-4)}</span>
              </p>
              <p>Block: {log.blockNumber.toString()}</p>
              <p className="truncate">
                Tx: {log.transactionHash.slice(0, 10)}...{log.transactionHash.slice(-8)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}