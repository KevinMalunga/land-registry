// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const LandRegistry = await ethers.getContractFactory("LandRegistry");
  const contract = await LandRegistry.deploy();
  await contract.waitForDeployment();

  console.log("LandRegistry deployed to:", await contract.getAddress());
  console.log("Copy this address into frontend/index.html (CONTRACT_ADDRESS)");
}

main().catch(console.error);
