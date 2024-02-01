import shuffleDeckFromHashedInputs from "./shuffle";
import { CheapVRFv2DirectFundingConsumer } from "../typechain-types";
import { connectVrfContract } from "./chain-interaction/connectContract";
import { ConfiguredNetwork } from "./types/";
import { randomNumber } from "./chain-interaction/randomNumber";
import { Wallet } from "ethers";

let contract: CheapVRFv2DirectFundingConsumer;

export const loadContract = (wallet: Wallet, testnet = false) => {
    const networkToLoad = testnet
        ? ConfiguredNetwork.MUMBAI
        : ConfiguredNetwork.POLYGON;
    contract = connectVrfContract(wallet, networkToLoad);
};

export const zeroTrustShuffle = async () => {
    if (!contract) {
        throw new Error("Must connect to contract first");
    }

    let wallet: Wallet = contract.runner as Wallet;
    if (!wallet || !("privateKey" in wallet)) {
        throw new Error(
            "Expected contract runner to be wallet. Use a wallet when loading contract."
        );
    }
    const { randomWord, requestId, hash } = await randomNumber(contract);
    const seed = randomWord.toString();

    const shuffledDeck = shuffleDeckFromHashedInputs(wallet.privateKey, seed);

    return {
        seed,
        shuffledDeck,
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
        tx: {
            hash,
            vrfRequestId: requestId,
        },
    };
};
