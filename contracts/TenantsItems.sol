// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";\

 
contract TenantsItems is ERC721Enumerable {


    using Strings for uint256;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("tenants", "TEA") {}

    function awardItem(address tenants, string memory tokenUrl  )
        public
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        mintNft(tenants, newItemId);
       _setTokenURI(newItemId, tokenUrl);
        _tokenIds.increment();
        return newItemId;
    }


    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }

       function _setTokenURI(uint256 tokenId, string memory _tokenURI) private  {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }



}