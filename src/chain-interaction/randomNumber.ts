import {
    CheapVRFv2DirectFundingConsumer,
    LinkTokenInterface,
} from "../../typechain-types";

// Minimum link required for VRF 18 decimals
const minLinkDec10 = 1_000_000_000_000_000n;

const generateRandomNumber = async (
    vrfContractAddress: string,
    linkTokenContract: LinkTokenInterface
) => {
    try {
        const tx = await linkTokenContract.transferAndCall(
            vrfContractAddress,
            minLinkDec10,
            "0x00",
            {
                gasLimit: 250_000,
            }
        );
        console.log(await tx.wait());
        return tx;
    } catch (e) {
        console.error(e);
    }
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
    linkContract: LinkTokenInterface
) => {
    return {
        ...(await generateRandomNumber(
            await vrfContract.getAddress(),
            linkContract
        )),
        ...(await retrieveRandomNumber(vrfContract)),
    };
};
