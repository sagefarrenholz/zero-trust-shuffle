import { config, ethers, network } from "hardhat";
import { zeroTrustShuffle, loadContract } from "../src";
import { ConfiguredNetwork } from "../src/types";
import { CheapVRFv2DirectFundingConsumer__factory } from "../typechain-types";
import { connectVrfContract } from "../src/chain-interaction/connectContract";

const main = async () => {
    const [signer] = await ethers.getSigners();
    const contract = connectVrfContract(
        signer,
        network.name as ConfiguredNetwork
    );
    const result = await contract.rawFulfillRandomWords.estimateGas(
        62304290086962510162453399358966700888208716437453977821987625915841092904761n,
        [
            33218643367722576209149763966127176037651265475941340936351792448305614610570n,
        ]
    );
    console.log(result);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
