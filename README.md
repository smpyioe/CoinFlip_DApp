# Coin Flip
```
forge create src/CoinFlip.sol:CoinFlip --rpc-url http://127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
```

```
cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "deposit()" --value 1ether --rpc-url http://127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

```
cast balance 0x5FbDB2315678afecb367f032d93F642f64180aa3 --rpc-url http://127.0.0.1:8545
```

```
cast logs --address 0x5FbDB2315678afecb367f032d93F642f64180aa3 "GameResult(address,bool,uint8)" --rpc-url http://127.0.0.1:8545
```



todo: 
- minimalist frontend
- test
- improve randomness (chainlink VRF)
- improve frontend
- depoly to baseSepolia