# Compile the smart contract
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Fuji testnet
npx hardhat run scripts/deploy.ts --network fuji

# Start local hardhat network
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.ts --network localhost

# Verify contract on snowtrace (after deployment)
npx hardhat verify --network fuji DEPLOYED_CONTRACT_ADDRESS "METADATA_URI"