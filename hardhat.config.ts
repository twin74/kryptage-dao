import 'dotenv/config';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL as string;
const DEPLOY_PRIVATE_KEY = (process.env.DEPLOY_PRIVATE_KEY || '').replace(/^0x/, '');

const config: HardhatUserConfig & any = {
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
      // @ts-ignore hardhat types
      type: 'http'
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY as string,
  },
};

export default config;
