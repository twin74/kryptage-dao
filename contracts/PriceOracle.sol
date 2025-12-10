// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface AggregatorV3Interface {
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
    function decimals() external view returns (uint8);
}

contract PriceOracle {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event FeedSet(address indexed asset, address indexed feed);
    event ManualPriceSet(address indexed asset, uint256 price1e18);

    modifier onlyOwner() { require(msg.sender == owner, "NOT_OWNER"); _; }

    constructor() { owner = msg.sender; emit OwnershipTransferred(address(0), msg.sender); }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ZERO_ADDRESS");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    mapping(address => address) public feeds; // asset => chainlink feed
    mapping(address => uint256) public manualPrice; // asset => price 1e18

    function setFeed(address asset, address feed) external onlyOwner {
        feeds[asset] = feed;
        emit FeedSet(asset, feed);
    }

    function setManualPrice(address asset, uint256 price1e18) external onlyOwner {
        manualPrice[asset] = price1e18;
        emit ManualPriceSet(asset, price1e18);
    }

    function getPrice(address asset) external view returns (uint256 price1e18, uint256 updatedAt) {
        address feed = feeds[asset];
        if (feed != address(0)) {
            AggregatorV3Interface agg = AggregatorV3Interface(feed);
            (, int256 answer, , uint256 ts, ) = agg.latestRoundData();
            require(answer > 0, "BAD_FEED");
            uint8 d = agg.decimals();
            // normalize to 1e18
            uint256 p = uint256(answer);
            if (d < 18) p = p * (10 ** (18 - d));
            else if (d > 18) p = p / (10 ** (d - 18));
            return (p, ts);
        }
        return (manualPrice[asset], block.timestamp);
    }
}
