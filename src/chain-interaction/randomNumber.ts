import { CheapVRFv2DirectFundingConsumer } from "../../typechain-types";

const generateRandomNumber = async (
    vrfContract: CheapVRFv2DirectFundingConsumer
) => {
    const tx = await vrfContract.requestRandomWords({
        gasLimit: 250_000,
    });
    return tx;
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
    vrfContract: CheapVRFv2DirectFundingConsumer
) => {
    return {
        ...(await generateRandomNumber(vrfContract)),
        ...(await retrieveRandomNumber(vrfContract)),
    };
};
