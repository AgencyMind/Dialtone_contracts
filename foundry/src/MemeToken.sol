// SPDX-License-Identifier: UNLICENSE
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./DialtoneErrors.sol";
import "./MemeDatabase.sol";

contract MemeToken is ERC20 {
    uint256 public memeId;
    uint256 public immutable maxTotalSupply;
    uint256 public immutable initialSupply;
    MemeDatabase private memeDatabase;

    constructor(
        string memory name,
        string memory symbol,
        address creator,
        address _memeDatabase,
        uint256 _maxTotalSupply,
        uint256 _initialSupply,
        uint256 _memeId
    ) ERC20(name, symbol) {
        if (_memeDatabase == address(0)) {
            revert DialtoneErrors.InvalidDatabase();
        }

        if (_initialSupply > _maxTotalSupply) {
            revert DialtoneErrors.SupplyExceeded();
        }

        memeDatabase = MemeDatabase(_memeDatabase);

        maxTotalSupply = _maxTotalSupply;
        initialSupply = _initialSupply;
        memeId = _memeId;

        _mint(creator, _initialSupply);
    }

    function mint(address to, uint256 amount) external {
        if (
            !memeDatabase.isTokenAdmin(msg.sender, memeId) &&
            msg.sender != address(memeDatabase)
        ) {
            revert DialtoneErrors.OnlyMemeDatabaseContract();
        }

        if (totalSupply() + amount > maxTotalSupply) {
            revert DialtoneErrors.SupplyExceeded();
        }

        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function getMemeDatabase() public view returns (address) {
        return address(memeDatabase);
    }
}
