# Compile the smart contract
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Fuji testnet
npx hardhat run scripts/deploy.ts --network fuji
