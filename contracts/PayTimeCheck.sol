// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract PayTimeCheck {

        function getPayTime(uint256 stratTime,uint256 payTime) public view returns (uint256 count) {
            count = (block.timestamp-stratTime)/payTime;
        }

        function getAllPayTime(uint256 validTime,uint256 payTime) public pure returns (uint256 count) {
            count = validTime/payTime;
        }

}