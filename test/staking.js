const {
  time,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Contract Deployment", function () {
  let tokenInstance;
  let Stakinginstance;
  let stakeAmount = "1000"
  let rewardRate = 1
  it("Contract deployment", async function () {
    const [owner, user1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("DEFI_Token");
    tokenInstance = await Token.connect(owner).deploy(owner.address);
    await tokenInstance.deployed();
    console.log("Token contract address :", tokenInstance.address);
    const Staking = await ethers.getContractFactory("Staking");
    Stakinginstance = await Staking.connect(owner).deploy(
      tokenInstance.address,
      rewardRate
    );
    await Stakinginstance.deployed();

    console.log("Staking contract address : ", Stakinginstance.address);
  })
  it("Scenario 1: Stake (Single Stake)", async function () {
    const [owner, user1] = await ethers.getSigners();
    await tokenInstance
      .connect(owner)
      .mint(user1.address, stakeAmount);
    await tokenInstance
      .connect(owner)
      .mint(Stakinginstance.address, stakeAmount);
    await tokenInstance
      .connect(user1)
      .approve(Stakinginstance.address, stakeAmount);
    await Stakinginstance.connect(user1).stake(stakeAmount);
  })
    it("Scenario 1: Withdraw (Single Stake)", async function () {
    const [owner, user1] = await ethers.getSigners();
    const initialBlockNumber = await ethers.provider.getBlockNumber();
    for (let i = 0; i < 10; i++) {
      await ethers.provider.send("evm_mine", []);
    }
    const finalBlockNumber = await ethers.provider.getBlockNumber();
    // User A withdraws
    const withdrawTx = await Stakinginstance.connect(user1).withdraw();
    await withdrawTx.wait();
    // Expected rewards
    const expectedRewards = (finalBlockNumber - initialBlockNumber) * 1;
    // Get user's balance after withdrawal
    const userABalance = await tokenInstance.balanceOf(user1.address);
    console.log("User should receive original stake + combined reward",Number(userABalance))
  });

    describe("Scenario 2: Multiple Stakes and Withdraw (Combined Rewards)", function () {
    let userA;
    beforeEach(async function () {
      userA = (await ethers.getSigners())[1];
      // Approve staking contract to transfer DEFI tokens
      await tokenInstance.connect(userA).approve(Stakinginstance.address, stakeAmount);
      // User A stakes 100 DEFI on BlockNumber1
      await Stakinginstance.connect(userA).stake(100);
      // Simulate some blocks passing
      for (let i = 0; i < 5; i++) {
        await ethers.provider.send("evm_mine", []);
      }
      // User A stakes 900 DEFI more on BlockNumber2
      await Stakinginstance.connect(userA).stake(900);
    });

    it("should pay combined rewards for multiple stakes on withdraw", async function () {
      const initialBlockNumber = await ethers.provider.getBlockNumber();

      // Simulate some more blocks passing
      for (let i = 0; i < 10; i++) {
        await ethers.provider.send("evm_mine", []);
      }

      const finalBlockNumber = await ethers.provider.getBlockNumber();

      // User A withdraws
      const withdrawTx = await Stakinginstance.connect(userA).withdraw();
      await withdrawTx.wait();

      // Expected total rewards for stake 1
      const rewardsStake1 = ((finalBlockNumber - initialBlockNumber) - 5) * 100 * rewardRate / 1000;

      // Expected total rewards for stake 2
      const rewardsStake2 = (finalBlockNumber - initialBlockNumber) * 900 * rewardRate / 1000;

      // Expected total rewards
      const expectedRewards = rewardsStake1 + rewardsStake2;
      // Get user's balance after withdrawal
      const userABalance = await tokenInstance.balanceOf(userA.address);
      console.log("User should receive original stake + combined reward",Number(userABalance))
    });
  });
});
