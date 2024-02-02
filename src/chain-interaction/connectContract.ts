import { Signer } from "ethers";
import ContractAddresses from "../contract-deployments.json";
import type { ContractDeploymentAddresses } from "../types";
import {
    CheapVRFv2DirectFundingConsumer__factory,
    LinkTokenInterface__factory,
} from "../../typechain-types";
import {
    ConfiguredNetwork,
    networkContractsAddresses,
} from "../types/constants";

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

export const connectLinkContract = (
    signer: Signer,
    network: ConfiguredNetwork
) => {
    const { LINK_TOKEN } = networkContractsAddresses[network];
    return LinkTokenInterface__factory.connect(LINK_TOKEN, signer);
};
