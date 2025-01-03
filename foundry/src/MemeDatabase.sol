// SPDX-License-Identifier: UNLICENSE
pragma solidity 0.8.24;

import "./DialtoneLibrary.sol";
import "./DialtoneErrors.sol";

contract MemeDatabase {
    uint256 private _memeCounter;
    mapping(uint256 => DialtoneLibrary.Meme) private _allMemes;

    event MemeAdded(uint256 memeId, string data);
    event MemeDeleted(uint256 memeId);

    modifier onlyMemeOwner(uint256 memeId) {
        if (msg.sender != _allMemes[memeId].owner) {
            revert DialtoneErrors.NotMemeOwner();
        }

        _;
    }

    constructor() payable {
        _memeCounter = 0;
    }

    function addMeme(string memory data, address token) external {
        _memeCounter++;

        _allMemes[_memeCounter] = DialtoneLibrary.Meme({
            owner: msg.sender,
            data: data,
            memeToken: token
        });

        emit MemeAdded(_memeCounter, data);
    }

    function deleteMeme(uint256 memeId) external onlyMemeOwner(memeId) {
        delete _allMemes[_memeCounter];

        emit MemeDeleted(_memeCounter);
    }

    function getMemeCounter() public view returns (uint256) {
        return _memeCounter;
    }

    function getMemeOwner(uint256 memeId) public view returns (address) {
        return _allMemes[memeId].owner;
    }

    function getMemeData(uint256 memeId) public view returns (string memory) {
        return _allMemes[memeId].data;
    }

    function getMemeToken(uint256 memeId) public view returns (address) {
        return _allMemes[memeId].memeToken;
    }
}
