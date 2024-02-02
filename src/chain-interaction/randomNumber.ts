import {
    CheapVRFv2DirectFundingConsumer,
    LinkTokenInterface,
} from "../../typechain-types";

// Minimum link required for VRF 18 decimals
const minLinkDec10 = 1_000_000_000_000_000n;

// proofOfOwnership is a signed string that is revealed after the game
const generateRandomNumber = async (
    vrfContractAddress: string,
    linkTokenContract: LinkTokenInterface,
    proofOfOwnershipMessage: string
) => {
    return linkTokenContract.transferAndCall(
        vrfContractAddress,
        minLinkDec10,
        proofOfOwnershipMessage,
        {
            gasLimit: 300_000,
        }
    );
};

const retrieveRandomNumber = async (
    vrfContract: CheapVRFv2DirectFundingConsumer
) => {
    return new Promise<{
        requestId: bigint;
        randomWord: bigint;
    }>((resolve) => {
        vrfContract.on(
            vrfContract.filters.RequestFulfilled,
            (requestId, [randomWord]) => {
                vrfContract.removeAllListeners();
                resolve({
                    requestId,
                    randomWord,
                });
            }
        );
    });
};

export const randomNumber = async (
    vrfContract: CheapVRFv2DirectFundingConsumer,
    linkContract: LinkTokenInterface,
    proofOfOwnershipMessage: string
) => {
    return {
        ...(await generateRandomNumber(
            await vrfContract.getAddress(),
            linkContract,
            proofOfOwnershipMessage
        )),
        ...(await retrieveRandomNumber(vrfContract)),
    };
};
