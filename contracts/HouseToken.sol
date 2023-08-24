// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";



contract HouseToken is ERC20 {

    using SafeERC20 for IERC20;

    constructor(uint256 initialSupply) ERC20("House", "H") {
        _mint(msg.sender, initialSupply);
    }

    
    function MintHouseToken(uint256 amount) public {
         _mint(msg.sender, amount);
    }



}