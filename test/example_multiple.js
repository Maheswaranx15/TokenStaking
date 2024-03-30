// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("DefiStaking", function () {
//   let stakingContract;
//   let stakeToken;
//   let owner;

//   beforeEach(async function () {
//     // Get signers
//     const signers = await ethers.getSigners();
//     owner = signers[0];

//     // Deploy ERC20 Mock (replace with your DEFI token deployment script)
//     const MockERC20 = await ethers.getContractFactory("MockERC20");
//     stakeToken = await MockERC20.deploy("DEFI", "DEFI");

//     // Deploy DefiStaking contract
//     const rewardRate = 1; // 1 DEFI per block per 1000 staked
//     stakingContract = await ethers.getContractFactory("DefiStaking").deploy(stakeToken.address, rewardRate);
//   });

//   describe("Scenario 2: Multiple Stakes and Withdraw (Combined Rewards)", function () {
//     let userA;

//     beforeEach(async function () {
//       userA = (await ethers.getSigners())[1];

//       // Approve staking contract to transfer DEFI tokens
//       await stakeToken.connect(userA).approve(stakingContract.address, 1000);

//       // User A stakes 100 DEFI on BlockNumber1
//       await stakingContract.connect(userA).stake(100);

//       // Simulate some blocks passing
//       for (let i = 0; i < 5; i++) {
//         await ethers.provider.send("evm_mine", []);
//       }

//       // User A stakes 900 DEFI more on BlockNumber2
//       await stakingContract.connect(userA).stake(900);
//     });

//     it("should pay combined rewards for multiple stakes on withdraw", async function () {
//       const initialBlockNumber = await ethers.provider.getBlockNumber();

//       // Simulate some more blocks passing
//       for (let i = 0; i < 10; i++) {
//         await ethers.provider.send("evm_mine", []);
//       }

//       const finalBlockNumber = await ethers.provider.getBlockNumber();

//       // User A withdraws
//       const withdrawTx = await stakingContract.connect(userA).withdraw();
//       await withdrawTx.wait();

//       // Expected total rewards for stake 1
//       const rewardsStake1 = (finalBlockNumber - initialBlockNumber - 5) * 100 * rewardRate / 1000;

//       // Expected total rewards for stake 2
//       const rewardsStake2 = (finalBlockNumber - initialBlockNumber) * 900 * rewardRate / 1000;

//       // Expected total rewards
//       const expectedRewards = rewardsStake1 + rewardsStake2;

//       // Get user's balance after withdrawal
//       const userABalance = await stakeToken.balanceOf(userA.address);

//       // User should receive original stake + combined rewards
//       expect(userABalance).to.equal(expectedRewards + 1000); 
//     });
//   });
// });
