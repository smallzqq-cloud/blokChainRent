// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";\

 
 interface Inft {
   

    function awardItem(address landlord, string memory tokenUrl  ) external  returns (uint256);
    


    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) external  returns (string memory);
      
    
}