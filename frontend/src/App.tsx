import { useAccount, useConnect, useDisconnect, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useWatchContractEvent } from 'wagmi'
import { anvil } from 'wagmi/chains'
import { useEffect } from 'react'
import { COINFLIP_ADDRESS, COINFLIP_ABI } from './contracts'
import { WalletStatus } from './components/WalletStatus'
import { DepositCard } from './components/DepositCard'
import { WithdrawCard } from './components/WithdrawCard'
import { CoinFlipGame } from './components/CoinFlipGame'
import { ConnectWallet } from './components/ConnectWallet'
import { GameHistory } from './components/GameHistory'

function App() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({ 
    address,
    chainId: anvil.id 
  })

  const isWrongNetwork = chain && chain.id !== anvil.id;

  useEffect(() => {
    if (isConnected && isWrongNetwork) {
      switchChain({ chainId: anvil.id })
    }
  }, [isConnected, isWrongNetwork, switchChain])

  useWatchContractEvent({
    address: COINFLIP_ADDRESS,
    abi: COINFLIP_ABI,
    eventName: 'GameResult',
    onLogs(logs) {
      console.log('New game result!', logs)
      // Recharger l'historique ou mettre à jour le state
    },
    onError(error) {
      console.log('Error', error)
    }
  })

  const { data: contractBalance, refetch } = useReadContract({
    address: COINFLIP_ADDRESS,
    abi: COINFLIP_ABI,
    functionName: 'getBalance',
    args: address ? [address] : undefined,
  })

  const { data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  if (isSuccess) {
    refetch()
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {isConnected && (
        <WalletStatus
          address={address}
          balance={balance}
          contractBalance={contractBalance}
          refetch={refetch}
          disconnect={disconnect}
        />
      )}

      {isConnected && (
        <div className="absolute top-4 left-4 flex flex-col gap-4 w-80">
          <DepositCard
            balance={balance}
            isPending={isPending}
            isConfirming={isConfirming}
          />
          <WithdrawCard
            contractBalance={contractBalance}
            isPending={isPending}
            isConfirming={isConfirming}
          />
          <GameHistory />
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
          <ConnectWallet connectors={connectors} connect={connect} />
        ) : (
          <CoinFlipGame
            contractBalance={contractBalance}
            isPending={isPending}
            isConfirming={isConfirming}
            isSuccess={isSuccess}
            hash={hash}
          />
        )}
      </div>
    </div>
  )
}

export default App