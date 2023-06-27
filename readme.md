# NFT-Hardhat

This repository contains a project that demonstrates the creation and deployment of Non-Fungible Tokens (NFTs) using the Hardhat development environment.

## Table of Contents

-   [Introduction](#introduction)
-   [Features](#features)
-   [Requirements](#requirements)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Contract Details](#contract-details)
-   [Deployment](#deployment)
-   [License](#license)

## Introduction

NFT-Hardhat is a project that showcases the process of creating and deploying NFTs using Hardhat. NFTs are unique digital assets that can represent ownership of various items such as art, collectibles, and virtual real estate. This repository provides a starting point for developers who want to dive into NFT development and understand the underlying technologies.

## Features

-   NFT contract implementation using Solidity.
-   Deployment of NFT contracts on a local development network.
-   Deployment of NFT contracts on Ethereum mainnet or testnet.
-   Metadata management for NFTs.
-   Sample scripts for interacting with NFT contracts.

## Requirements

To run this project, you need the following:

-   Node.js (version 12 or higher)
-   npm (Node package manager)
-   Hardhat (development environment for Ethereum)
-   Ethereum account with testnet or mainnet access (e.g., MetaMask)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/PrateekSavanur/NFT-Hardhat.git
```

2. Change into the project directory:

```bash
cd NFT-Hardhat
```

3. Install the required dependencies:

```bash
npm install
```

## Usage

1. Configure your Ethereum network settings by updating the `hardhat.config.js` file.

2. Compile the contracts:

```bash
yarn hardhat compile
```

3. Run the local development network:

```bash
npx hardhat node
```

4. Deploy the NFT contract on the local network:

```bash
yarn hardhat deploy
```

5. Interact with the deployed NFT contract by using the provided sample scripts in the `scripts` directory.

6. To deploy the NFT contract on the Ethereum mainnet or testnet, update the network configuration in `hardhat.config.js` and run the deployment script with the desired network:

```bash
yarn hardhat deploy --network <network-name>
```

## Contract Details

The NFT contract implemented in this project follows the ERC721 standard, which defines the required functions and events for a non-fungible token. The contract supports the following features:

-   Creation of unique NFTs with individual token IDs.
-   Metadata storage for each NFT, including name, symbol, and additional properties.
-   Token ownership tracking and transfer functionality.
-   Approval and transfer of tokens on behalf of the token owner.
-   Event emission for token transfers and approvals.

To understand the contract implementation in more detail, please refer to the Solidity source file `contracts/NFT.sol`.

## Deployment

The deployment script provided in this project enables you to deploy the NFT contract on different Ethereum networks. Here are the steps to deploy the contract:

1. Make sure you have configured your Ethereum network settings in the `hardhat.config.js` file.

2. Run the deployment script with the desired network:

```bash
yarn hardhat deploy --network <network-name>
```

The deployment script will compile the contract, deploy it on the specified network, and display the contract address after successful deployment

.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use and modify the code according to your needs.
