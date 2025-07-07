import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    ganache: {
      url: 'HTTP://127.0.0.1:7545', // Todo: Ganache RPC URL
      accounts: [
        process.env.PRIVATE_KEY || '0x441dc842ecabd58e9fe44a1a8fa7f564893e03568a09e677c158ca8c7a430ac7',
      ],
    },
    sepolia: {
      url: 'https://sepolia.infura.io/v3/b7497c1d6ddf4d94a13ca50026bc2f93',
      accounts: ['0x4c3f92e8746e766529c19535f4c6edfb3052e18d59133fda5eda2cd97de600b1'],
    },
  },
};

export default config;
