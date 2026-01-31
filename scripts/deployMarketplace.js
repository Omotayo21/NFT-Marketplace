import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy NFT Contract
  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("NFT contract deployed to:", nftAddress);

  // Deploy Marketplace Contract
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const feePercent = 1;
  const marketplace = await Marketplace.deploy(feePercent);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("Marketplace contract deployed to:", marketplaceAddress);

  // Save data for frontend
  const data = {
    nft: {
      address: nftAddress,
      abi: JSON.parse(nft.interface.formatJson())
    },
    marketplace: {
      address: marketplaceAddress,
      abi: JSON.parse(marketplace.interface.formatJson())
    }
  };

  // Check if frontend directory exists, if not, save to current dir for now
  const frontendDir = "./app/src/contracts";
  if (!fs.existsSync(frontendDir)){
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  fs.writeFileSync(
    `${frontendDir}/MarketplaceData.json`, 
    JSON.stringify(data, null, 2)
  );
  
  console.log("Contract data saved to frontend!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
