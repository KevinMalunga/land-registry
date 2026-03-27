// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LandRegistry {

    struct Land {
        string  landId;
        bytes32 titleHash;
        address owner;
        uint256 timestamp;
        bool    exists;
    }

    struct Transfer {
        address from;
        address to;
        uint256 timestamp;
    }

    address public admin;

    mapping(string => Land)       public lands;
    mapping(string => Transfer[]) public history;
    mapping(bytes32 => bool)      public hashExists;

    event LandRegistered(string landId, address owner);
    event OwnershipTransferred(string landId, address from, address to);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    // Register a new land parcel
    function registerLand(string memory landId, bytes32 titleHash) public {
        require(!lands[landId].exists,  "Land already registered");
        require(!hashExists[titleHash], "Duplicate document hash");

        lands[landId] = Land(landId, titleHash, msg.sender, block.timestamp, true);
        hashExists[titleHash] = true;

        history[landId].push(Transfer(address(0), msg.sender, block.timestamp));

        emit LandRegistered(landId, msg.sender);
    }

    // Transfer ownership to another address
    function transferOwnership(string memory landId, address newOwner) public {
        require(lands[landId].exists,           "Land not found");
        require(lands[landId].owner == msg.sender, "Not the owner");
        require(newOwner != address(0),         "Invalid address");

        address prev = lands[landId].owner;
        lands[landId].owner = newOwner;

        history[landId].push(Transfer(prev, newOwner, block.timestamp));

        emit OwnershipTransferred(landId, prev, newOwner);
    }

    // Verify if a document hash matches what is on chain
    function verifyTitle(string memory landId, bytes32 titleHash) public view returns (bool) {
        require(lands[landId].exists, "Land not found");
        return lands[landId].titleHash == titleHash;
    }

    // Get number of transfers for a land parcel
    function getHistoryCount(string memory landId) public view returns (uint256) {
        return history[landId].length;
    }

    // Get a single transfer record by index
    function getTransfer(string memory landId, uint256 index)
        public view
        returns (address from, address to, uint256 timestamp)
    {
        Transfer memory t = history[landId][index];
        return (t.from, t.to, t.timestamp);
    }
}
