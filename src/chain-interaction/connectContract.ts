import { Signer } from "ethers";
import ContractAddresses from "../contract-deployments.json";
import type { ConfiguredNetwork, ContractDeploymentAddresses } from "../types";
import { CheapVRFv2DirectFundingConsumer__factory } from "../../typechain-types";

const contractAddresses = <ContractDeploymentAddresses>ContractAddresses;

export const connectVrfContract = (
    signer: Signer,
    network: ConfiguredNetwork
) => {
    const contractAddress = contractAddresses[network];
    if (!contractAddress) {
        throw new Error("No contract address found, try deploying");
    }
    return CheapVRFv2DirectFundingConsumer__factory.connect(
        contractAddress,
        signer
    );
};
