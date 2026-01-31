import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const YourCollectibleModule = buildModule("YourCollectibleModule", (m) => {
  // Get the deployer address (the first account by default)
  const deployer = m.getAccount(0);

  // Deploy the contract, passing the deployer as the initialOwner
  const collectible = m.contract("YourCollectible", [deployer]);

  return { collectible };
});

export default YourCollectibleModule;
