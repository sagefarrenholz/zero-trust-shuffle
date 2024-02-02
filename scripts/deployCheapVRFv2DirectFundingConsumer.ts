import fs from "fs/promises";
import { CheapVRFv2DirectFundingConsumer__factory } from "../typechain-types";
import type { ContractDeploymentAddresses } from "../src/types";
import { ethers, network } from "hardhat";
import path from "path";
import { networkContractsAddresses } from "../src/types/constants";

const OUTPUT_FILE = path.join(
    __dirname,
    "..",
    "src",
    "contract-deployments.json"
);

const main = async () => {
    const { LINK_TOKEN, VRF_WRAPPER } = networkContractsAddresses[network.name];
    const [signer] = await ethers.getSigners();

    const cheapVRFv2DirectFundingConsumerFactory =
        new CheapVRFv2DirectFundingConsumer__factory(signer);

    const cheapVRF = await cheapVRFv2DirectFundingConsumerFactory.deploy(
        LINK_TOKEN,
        VRF_WRAPPER
    );

    await cheapVRF.waitForDeployment();

    let existingFile: ContractDeploymentAddresses = {};
    try {
        existingFile = JSON.parse(await fs.readFile(OUTPUT_FILE, "utf-8"));
    } catch (e) {}

    return fs.writeFile(
        OUTPUT_FILE,
        JSON.stringify({
            ...existingFile,
            [network.name]: await cheapVRF.getAddress(),
        })
    );
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
