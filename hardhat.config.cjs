require('dotenv/config');
require('@nomicfoundation/hardhat-toolbox');

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const DEPLOY_PRIVATE_KEY = (process.env.DEPLOY_PRIVATE_KEY || '').replace(/^0x/, '');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { version: '0.8.20', settings: { optimizer: { enabled: true, runs: 200 } } },
      { version: '0.8.23', settings: { optimizer: { enabled: true, runs: 200 } } },
    ],
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: DEPLOY_PRIVATE_KEY ? [DEPLOY_PRIVATE_KEY] : [],
      type: 'http'
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
