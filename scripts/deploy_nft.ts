import { network } from "hardhat";
const { ethers } = await network.connect();

async function main() {
  console.log("Deploying YourCollectible...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy the contract
  const YourCollectible = await ethers.getContractFactory("YourCollectible");
  const collectible = await YourCollectible.deploy(deployer.address);

  await collectible.waitForDeployment();

  const address = await collectible.getAddress();
  console.log("YourCollectible deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
