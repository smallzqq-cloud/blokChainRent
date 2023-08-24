// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";\

 
 interface IhouseItems {
   

    function awardHouseItem(address landlord) external  returns (uint256);
    


    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
  
    function CancleItem(uint256 tokenId) external ; 
     function ownerOf(uint256 tokenId) external view returns (address);
}