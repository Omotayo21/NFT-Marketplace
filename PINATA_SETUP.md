# Pinata Setup Guide

## Step 1: Sign Up for Pinata
1. Go to https://www.pinata.cloud/
2. Click "Sign Up" (top right)
3. Create a free account with your email

## Step 2: Get Your API Keys
1. After logging in, go to your dashboard
2. Click on "API Keys" in the left sidebar
3. Click "New Key" button
4. Give it a name like "NFT Marketplace"
5. Enable the following permissions:
   - `pinFileToIPFS`
   - `pinJSONToIPFS`
6. Click "Create Key"
7. **IMPORTANT**: Copy both the API Key and API Secret immediately (you won't be able to see the secret again!)

## Step 3: Add Keys to Your Project
1. Open the `.env` file in the `solidity` folder
2. Replace the placeholders:
   ```
   VITE_PINATA_API_KEY=your_actual_api_key_here
   VITE_PINATA_API_SECRET=your_actual_api_secret_here
   ```

## Step 4: Restart Your Dev Server
After updating the `.env` file, restart the frontend:
```bash
# Stop the current dev server (Ctrl+C)
# Then restart it
npm run dev
```

## Free Tier Limits
- 1 GB of storage
- Unlimited pinning
- Perfect for development and small projects!
