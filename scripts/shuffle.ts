import { config, ethers, network } from "hardhat";
import { zeroTrustShuffle, loadContract } from "../src";
import { ConfiguredNetwork } from "../src/types";

const main = async () => {
    const test = network.name === ConfiguredNetwork.MUMBAI;

    const currentNetwork = config.networks[network.name];
    const privateKey = currentNetwork.accounts[0];

    if (!("url" in currentNetwork)) {
        throw new Error("Expected rpc url");
    }
    const provider = new ethers.JsonRpcProvider(currentNetwork.url, undefined);
    const wallet = new ethers.Wallet(privateKey, provider);

    loadContract(wallet, test);
    console.log(await zeroTrustShuffle());
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
