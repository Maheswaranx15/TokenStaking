// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");

async function main() {

  let ownerAddress = '0x4127438175487237x27rtt3e1289742'
  let rewardRate = 1
  const Token = await hre.ethers.getContractFactory("pokpok");
  const token = await Token.deploy(ownerAddress);
  await token.deployed();
  
  console.log(
    `contract deployment address`, token.address
  );

  const Staking = await hre.ethers.getContractFactory("pokpok");
  const staking = await Staking.deploy(token.address,rewardRate);
  await staking.deployed();

  console.log(
    `contract deployment address`, staking.address
  );


  const Contractdata = {
    address: contract.address,
    abi: JSON.parse(contract.interface.format('json'))
  }

  fs.writeFileSync('./contract.json', JSON.stringify(Contractdata))

  //Verify the smart contract using hardhat 
  await hre.run("verify:verify", {
    address: 'ContractAddress',
    constructorArguments: [tokenaddress,rewardrate]
  });

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});