require('dotenv/config');
require('@nomicfoundation/hardhat-verify');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { version: '0.8.23', settings: { optimizer: { enabled: true, runs: 200 }, evmVersion: 'shanghai' } },
    ],
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: (process.env.DEPLOY_PRIVATE_KEY || '').replace(/^0x/, '') ? [(process.env.DEPLOY_PRIVATE_KEY || '').replace(/^0x/, '')] : [],
      type: 'http'
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
