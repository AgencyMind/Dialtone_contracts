// SPDX-License-Identifier: UNLICENSE
pragma solidity 0.8.24;

import "./DialtoneLibrary.sol";
import "./DialtoneErrors.sol";
import "./MemeToken.sol";

contract MemeDatabase {
    uint256 private _memeCounter;
    mapping(uint256 => DialtoneLibrary.Meme) private _allMemes;
    mapping(uint256 => mapping(address => bool)) private _tokenAdmin;
    mapping(uint256 => address[]) private _tokenAdmins;

    event MemeAdded(uint256 memeId, string data);
    event MemeDeleted(uint256 memeId);
    event MemeEdited(uint256 memeId);
    event AdminAdded(address wallet, uint256 memeId);
    event AdminRemoved(address wallet, uint256 memeId);
    event WorkflowsAdded(uint256 memeId);

    modifier onlyMemeOwner(uint256 memeId) {
        if (msg.sender != _allMemes[memeId].owner) {
            revert DialtoneErrors.NotMemeOwner();
        }

        _;
    }

    constructor() payable {
        _memeCounter = 0;
    }

    function addMeme(
        string memory name,
        string memory symbol,
        string memory data,
        address feedContract,
        uint256 initialSupply,
        uint256 maxSupply
    ) external {
        _memeCounter++;

        _tokenAdmin[_memeCounter][msg.sender] = true;

        MemeToken _token = new MemeToken(
            name,
            symbol,
            msg.sender,
            address(this),
            maxSupply,
            initialSupply,
            _memeCounter
        );

        _allMemes[_memeCounter] = DialtoneLibrary.Meme({
            owner: msg.sender,
            data: data,
            name: name,
            symbol: symbol,
            feed: feedContract,
            token: address(_token),
            workflows: new uint256[](0)
        });

        emit MemeAdded(_memeCounter, data);
    }

    function addTokenAdmin(
        address newAdmin,
        uint256 memeId
    ) external onlyMemeOwner(memeId) {
        if (newAdmin == _allMemes[memeId].owner) {
            revert DialtoneErrors.CantAddSelf();
        }
        _tokenAdmin[memeId][newAdmin] = true;
        emit AdminAdded(newAdmin, memeId);
    }

    function removeTokenAdmin(
        address newAdmin,
        uint256 memeId
    ) external onlyMemeOwner(memeId) {
        if (newAdmin == _allMemes[memeId].owner) {
            revert DialtoneErrors.CantRemoveSelf();
        }
        _tokenAdmin[memeId][newAdmin] = false;
        emit AdminRemoved(newAdmin, memeId);
    }

    function addWorkflows(
        uint256[] memory _workflows,
        uint256 memeId
    ) external onlyMemeOwner(memeId) {
        _allMemes[memeId].workflows = _workflows;
        emit WorkflowsAdded(memeId);
    }

    function editMeme(
        string memory data,
        address feedContract,
        uint256 memeId
    ) external onlyMemeOwner(memeId) {
        _allMemes[_memeCounter].data = data;
        _allMemes[_memeCounter].feed = feedContract;

        emit MemeEdited(memeId);
    }

    function deleteMeme(uint256 memeId) external onlyMemeOwner(memeId) {
        delete _allMemes[memeId];

        address[] memory _admins = _tokenAdmins[memeId];

        for (uint256 i; i < _admins.length; i++) {
            delete _tokenAdmin[memeId][_admins[i]];
        }
        delete _tokenAdmins[memeId];

        emit MemeDeleted(memeId);
    }

    function getMemeCounter() public view returns (uint256) {
        return _memeCounter;
    }

    function isTokenAdmin(
        address wallet,
        uint256 memeId
    ) public view returns (bool) {
        return _tokenAdmin[memeId][wallet];
    }

    function getMemeOwner(uint256 memeId) public view returns (address) {
        return _allMemes[memeId].owner;
    }

    function getMemeData(uint256 memeId) public view returns (string memory) {
        return _allMemes[memeId].data;
    }

    function getMemeToken(uint256 memeId) public view returns (address) {
        return _allMemes[memeId].token;
    }

    function getMemeTokenName(
        uint256 memeId
    ) public view returns (string memory) {
        return _allMemes[memeId].name;
    }

    function getMemeTokenSymbol(
        uint256 memeId
    ) public view returns (string memory) {
        return _allMemes[memeId].symbol;
    }

    function getMemeTokenWorkflows(
        uint256 memeId
    ) public view returns (uint256[] memory) {
        return _allMemes[memeId].workflows;
    }

    function getMemeTokenFeed(uint256 memeId) public view returns (address) {
        return _allMemes[memeId].feed;
    }
}
