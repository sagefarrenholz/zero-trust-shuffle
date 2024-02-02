import shuffleDeckFromHashedInputs from "./shuffle";
import {
    CheapVRFv2DirectFundingConsumer,
    LinkTokenInterface,
} from "../typechain-types";
import {
    connectLinkContract,
    connectVrfContract,
} from "./chain-interaction/connectContract";
import { randomNumber } from "./chain-interaction/randomNumber";
import { Wallet } from "ethers";
import { ConfiguredNetwork } from "./types/constants";

let vrfContract: CheapVRFv2DirectFundingConsumer;
let linkContract: LinkTokenInterface;

const loadVrfContract = (wallet: Wallet, testnet = false) => {
    const networkToLoad = testnet
        ? ConfiguredNetwork.MUMBAI
        : ConfiguredNetwork.POLYGON;
    vrfContract = connectVrfContract(wallet, networkToLoad);
};
const loadLinkContract = (wallet: Wallet, testnet = false) => {
    const networkToLoad = testnet
        ? ConfiguredNetwork.MUMBAI
        : ConfiguredNetwork.POLYGON;
    linkContract = connectLinkContract(wallet, networkToLoad);
};
export const loadContracts = (wallet: Wallet, testnet = false) => {
    loadLinkContract(wallet, testnet);
    loadVrfContract(wallet, testnet);
};

export const zeroTrustShuffle = async () => {
    if (!vrfContract) {
        throw new Error("Must connect to contract first");
    }

    let wallet: Wallet = vrfContract.runner as Wallet;
    if (!wallet || !("privateKey" in wallet)) {
        throw new Error(
            "Expected contract runner to be wallet. Use a wallet when loading contract."
        );
    }
    const { randomWord, requestId, hash } = await randomNumber(
        vrfContract,
        linkContract
    );
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
