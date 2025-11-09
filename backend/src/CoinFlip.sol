// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract CoinFlip {
    enum CoinGuess{
        Heads,
        Tails
    }

    mapping(address => uint256) public balances;

    function deposit() external payable {
        require(msg.value > 0, "Must send ETH");
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    event GameResult(address player, bool win, CoinGuess guess);

    function flip(CoinGuess guess, uint256 amount) external {
        require(balances[msg.sender]>=amount, "Not enough balance");
        CoinGuess result = CoinGuess(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 2);

        bool win = (result==guess);
        if (win){
            balances[msg.sender] += amount;
        }
        else{
            balances[msg.sender] -= amount;
        }

        emit GameResult(msg.sender, win, guess);
    }

    function getBalance(address check) view external returns (uint256){
        return balances[check];
    }
}
