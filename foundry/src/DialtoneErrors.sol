// SPDX-License-Identifier: UNLICENSE
pragma solidity 0.8.24;

contract DialtoneErrors {
    error NotSessionOwner();

    error NotMemeOwner();

    error CantAddSelf();
    error CantRemoveSelf();

    error SupplyExceeded();
    error OnlyMemeDatabaseContract();
    error InvalidDatabase();
}
