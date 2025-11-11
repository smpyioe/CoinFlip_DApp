export const COINFLIP_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3' as `0x${string}`

export const COINFLIP_ABI = [
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "enum CoinFlip.CoinGuess", "name": "guess", "type": "uint8"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "flip",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "check", "type": "address"}],
    "name": "getBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "balances",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "address", "name": "player", "type": "address"},
      {"indexed": false, "internalType": "bool", "name": "win", "type": "bool"},
      {"indexed": false, "internalType": "enum CoinFlip.CoinGuess", "name": "guess", "type": "uint8"}
    ],
    "name": "GameResult",
    "type": "event"
  }
] as const