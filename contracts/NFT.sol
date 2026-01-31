// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage {
    uint256 public tokenCount;

    constructor() ERC721("Marketplace NFT", "MNFT") {}

    function mint(string memory tokenURI) public returns (uint256) {
        tokenCount++;
        uint256 newItemId = tokenCount;
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}
