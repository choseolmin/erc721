// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyNFT2 {
    string private _name;
    string private _symbol;
    uint256 private _tokenIdCounter;
    uint256 public lastMintedId;

    mapping(uint256 => address) private _owners; // 토큰 ID → 소유자 주소
    mapping(address => uint256) private _balances; // 주소 → NFT 보유 수
    mapping(uint256 => string) private _tokenURIs; // 토큰 ID → URI
    mapping(uint256 => address) private _tokenApprovals; // 토큰 ID → 승인된 주소

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "Account not found.");
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "Owner not found.");
        return owner;
    }

    function mint(address recipient, string memory _tokenURI) public returns (uint256) {
        require(recipient != address(0), "Account not found.");

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _owners[newTokenId] = recipient;
        _balances[recipient]++;
        _tokenURIs[newTokenId] = _tokenURI;

        lastMintedId = newTokenId;

        emit Transfer(address(0), recipient, newTokenId);

        return newTokenId;
    }

    function approve(address to, uint256 tokenId) public {
        address owner = _owners[tokenId];
        require(to != owner, "Cannot approve current owner.");
        require(msg.sender == owner, "Not authorized.");

        _approve(to, tokenId);
    }

    function getApproved(uint256 tokenId) public view returns (address) {
        require(_owners[tokenId] != address(0), "Token does not exist.");
        return _tokenApprovals[tokenId];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(from != address(0), "Account not found.");
        require(to != address(0), "Account not found.");
        require(from == _owners[tokenId], "Not owner of tokenId.");
        require(msg.sender == from || getApproved(tokenId) == msg.sender, "Not authorized.");

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        _approve(address(0), tokenId);

        emit Transfer(from, to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_owners[tokenId] != address(0), "URI not found.");
        return _tokenURIs[tokenId];
    }

    function _approve(address to, uint256 tokenId) private {
        _tokenApprovals[tokenId] = to;
        emit Approval(_owners[tokenId], to, tokenId);
    }
}
