# 🦊 Wallet & Network Setup (Sepolia)

To interact with the NFT Marketplace on the Sepolia testnet, follow these steps:

## 1. Get MetaMask
If you haven't already, install the [MetaMask extension](https://metamask.io/).

## 2. Switch to Sepolia Test Network
1. Open MetaMask.
2. Click the network selector in the top left.
3. Toggle "Show test networks" if it's off.
4. Select **Sepolia**.

## 3. Get Test ETH (Faucets)
You need testnet ETH to pay for gas and mint NFTs. Use one of these faucets:
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

## 4. IPFS Setup (Pinata)
The metadata (images and JSON) for your NFTs is stored on IPFS.
1. Create a free account at [Pinata](https://www.pinata.cloud/).
2. Generate an API Key.
3. Add `VITE_PINATA_API_KEY` and `VITE_PINATA_API_SECRET` to your `.env` file in the root directory.

## 5. Deployment
When you are ready to deploy your own version:
```bash
npx hardhat run scripts/deployMarketplace.js --network sepolia
```

---
*Your marketplace is now ready for the decentralized web!*
