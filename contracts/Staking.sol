pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {
    // Address of the DEFI token contract
    address public stakeToken;

    struct Stake {
        uint amount;
        uint startingBlock;
    }
    // Keeps track of user's staked tokens and their starting block
    mapping(address => Stake) public stakes;

    // Total DEFI tokens staked in the contract
    uint public totalStaked;

    // DEFI tokens rewarded per block per 1000 staked DEFI
    uint public rewardRate;

    constructor(address _stakeToken, uint _rewardRate) {
        stakeToken = _stakeToken;
        rewardRate = _rewardRate;
    }
    // Modifier to check if user has a stake
    modifier hasStake() {
        require(stakes[msg.sender].amount > 0, "No stake found for the user");
        _;
    }

    // Stake DEFI tokens
    function stake(uint _amount) public {
        // Transfer DEFI tokens from user to contract
        IERC20(stakeToken).transferFrom(msg.sender, address(this), _amount);

        // Update user's stake
        stakes[msg.sender].amount += _amount;
        if (stakes[msg.sender].startingBlock == 0) {
            stakes[msg.sender].startingBlock = block.number;
        }
        totalStaked += _amount;
    }

    // Withdraw staked DEFI tokens and earned rewards
    function withdraw() public hasStake {
        uint unclaimedRewards = calculateRewards(msg.sender);
        uint totalAmount = stakes[msg.sender].amount + unclaimedRewards;
        delete stakes[msg.sender];
        totalStaked -= stakes[msg.sender].amount;

        // Transfer DEFI tokens (stake + rewards) to user
        IERC20(stakeToken).transfer(msg.sender, totalAmount);
    }

    // View user's current unclaimed rewards
    function getRewards() public view hasStake returns (uint) {
        return calculateRewards(msg.sender);
    }

    // Internal function to calculate unclaimed rewards for a user
    function calculateRewards(address _user) internal view returns (uint) {
        Stake storage userStake = stakes[_user];
        uint blocksStaked = block.number - userStake.startingBlock;
        return blocksStaked * userStake.amount * rewardRate / 1000;
    }
}