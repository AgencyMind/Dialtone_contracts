// SPDX-License-Identifier: UNLICENSE
pragma solidity 0.8.24;

contract DialtoneLibrary {
    struct Session {
        string encryptedData;
        address owner;
    }

    struct Meme {
        uint256[] workflows;
        string data;
        string name;
        string symbol;
        address feed;
        address token;
        address owner;
    }
}
