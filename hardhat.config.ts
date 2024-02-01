import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-verify";

import { HardhatUserConfig } from "hardhat/types";
import { config } from "dotenv";
import { ConfiguredNetwork } from "./src/types";

const privateKeysFromEnv = (): {
    [network in ConfiguredNetwork]: string | undefined;
} => {
    const env = process.env;
    return {
        mumbai: env.MUMBAI_PRIVATE_KEY,
        polygon: env.POLYGON_PRIVATE_KEY,
    };
};

// Load env variables
config();
const privateKeys = privateKeysFromEnv();

module.exports = <HardhatUserConfig>{
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 2 ** 32 - 1,
            },
        },
    },
    networks: {
        mumbai: {
            chainId: 80001,
            accounts: privateKeys.mumbai ? [privateKeys.mumbai] : [],
            url: "https://polygon-mumbai-bor.publicnode.com",
        },
        polygon: {
            chainId: 137,
            accounts: privateKeys.polygon ? [privateKeys.polygon] : [],
            url: "https://polygon.llamarpc.com",
        },
    },
    etherscan: {
        apiKey: process.env.POLYGONSCAN_API_KEY,
    },
};
