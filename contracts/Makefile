# Define the paths
UI_DIR = ../ui
SCRIPT_DIR = script
OUT_DIR = out
ABI_DEST_DIR = $(UI_DIR)/abi

-include .env

# # Default target
all: build copy-abi

# # Build contracts using Foundry
build:
	forge build

# # Copy the ABI to the UI directory
copy-abi: build
	node $(SCRIPT_DIR)/copyAbi.js

# # Clean build artifacts
clean:
	rm -rf $(OUT_DIR)
	rm -rf $(ABI_DEST_DIR)/*.json


# .PHONY: deploy
.PHONY: deploy all build copy-abi clean

# deploy :; @forge script script/AuthorizeContract.s.sol --private-key ${PRIVATE_KEY} --rpc-url ${SEPOLIA_RPC_URL} --etherscan-api-key ${ETHERSCAN_API_KEY} --verify --broadcast
# deploy :; @forge script script/DeployMockUSDC.s.sol --private-key ${PRIVATE_KEY} --rpc-url ${SEPOLIA_RPC_URL} --etherscan-api-key ${ETHERSCAN_API_KEY} --verify --broadcast

# forge script script/DeployTBill.s.sol:DeployTBill --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80