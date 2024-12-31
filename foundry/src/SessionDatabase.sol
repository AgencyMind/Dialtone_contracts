// SPDX-License-Identifier: UNLICENSE
pragma solidity 0.8.24;

import "./DialtoneLibrary.sol";
import "./DialtoneErrors.sol";

contract SessionDatabase {
    uint256 private _sessionCounter;
    mapping(uint256 => DialtoneLibrary.Session) private _allSessions;

    modifier onlySessionOwner(uint256 sessionId) {
        if (msg.sender != _allSessions[sessionId].owner) {
            revert DialtoneErrors.NotSessionOwner();
        }

        _;
    }

    event SessionAdded(uint256 sessionId, string encryptedData);
    event SessionUpdated(uint256 sessionId, string encryptedData);
    event SessionDeleted(uint256 sessionId);

    constructor() payable {
        _sessionCounter = 0;
    }

    function addNewSession(string memory encryptedData) external {
        _sessionCounter++;

        _allSessions[_sessionCounter] = DialtoneLibrary.Session({
            owner: msg.sender,
            encryptedData: encryptedData
        });

        emit SessionAdded(_sessionCounter, encryptedData);
    }

    function updateSession(
        uint256 sessionId,
        string memory encryptedData
    ) external onlySessionOwner(sessionId) {
        _sessionCounter++;

        _allSessions[_sessionCounter].encryptedData = encryptedData;

        emit SessionUpdated(_sessionCounter, encryptedData);
    }

    function deleteSession(
        uint256 sessionId
    ) external onlySessionOwner(sessionId) {
        _sessionCounter++;

        delete _allSessions[_sessionCounter];

        emit SessionDeleted(_sessionCounter);
    }

    function getSessionCounter() public view returns (uint256) {
        return _sessionCounter;
    }

    function getSessionOwner(uint256 sessionId) public view returns (address) {
        return _allSessions[sessionId].owner;
    }

    function getSessionEncryptedData(
        uint256 sessionId
    ) public view returns (string memory) {
        return _allSessions[sessionId].encryptedData;
    }
}
