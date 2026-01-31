# 💎 Premium NFT Marketplace

A high-performance, aesthetically stunning NFT Marketplace dApp built with Solidity, React, and Tailwind CSS. This project allows users to mint, list, and trade digital assets on the Ethereum Sepolia testnet.

![Marketplace Preview](https://via.placeholder.com/1200x600/020617/6366f1?text=NFT+Marketplace+Portfolio+Project)

## 🕹️ How it Works

The marketplace operates as a decentralized escrow system:

1. **Minting**: Users upload an image and metadata to **IPFS** via Pinata. The resulting hash is stored on the **NFT contract**.
2. **Listing**: The seller approves the **Marketplace contract** to transfer the NFT. The marketplace locks the NFT until it is either sold or the listing is cancelled.
3. **Trading**: When a buyer purchases an item, the marketplace handles the ETH transfer (including a 1% platform fee) and atomicity transfers the NFT to the buyer.

## 📖 Detailed Tutorial
For a deep dive into the code and architecture, check out the [TUTORIAL.md](file:///c:/Users/hp/Desktop/my%20codes/web3%20projects/solidity/TUTORIAL.md) file!

## 📦 Getting Started
... [Rest of installation steps]

### 1. Prerequisites
- Node.js & npm installed
- MetaMask wallet with some Sepolia ETH
- Pinata API Keys (for IPFS storage)

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
SEPOLIA_URL=your_alchemy_or_infura_url
PRIVATE_KEY=your_metamask_private_key
VITE_PINATA_API_KEY=your_pinata_key
VITE_PINATA_API_SECRET=your_pinata_secret
```

### 3. Installation
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd app
npm install
```

### 4. Smart Contract Deployment
To deploy your own contracts to Sepolia:
```bash
npx hardhat run scripts/deployMarketplace.js --network sepolia
```
*Note: This will automatically update the frontend contract data.*

### 5. Run the App
```bash
cd app
npm run dev
```

## 📜 Smart Contracts

- **NFT.sol**: ERC-721 contract with URI storage.
- **Marketplace.sol**: Handles listing logic, ownership transfers, and marketplace fees.

## 🤝 Contributing
Feel free to fork this project and add your own features, such as auctioning, royalties, or support for multiple chains!

---
*Built for excellence.*
