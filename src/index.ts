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
import { JsonRpcProvider, Signer, Wallet } from "ethers";
import { ConfiguredNetwork } from "./types/constants";

export * from "./shuffle/cards";

let vrfContract: CheapVRFv2DirectFundingConsumer;
let linkContract: LinkTokenInterface;

const loadVrfContract = (signer: Signer, testnet = false) => {
    const networkToLoad = testnet
        ? ConfiguredNetwork.MUMBAI
        : ConfiguredNetwork.POLYGON;
    vrfContract = connectVrfContract(signer, networkToLoad);
};
const loadLinkContract = (signer: Signer, testnet = false) => {
    const networkToLoad = testnet
        ? ConfiguredNetwork.MUMBAI
        : ConfiguredNetwork.POLYGON;
    linkContract = connectLinkContract(signer, networkToLoad);
};
export const loadContracts = (signer: Signer, testnet = false) => {
    loadLinkContract(signer, testnet);
    loadVrfContract(signer, testnet);
};

const POLYGON_CHAIN_ID = 137;
const DEFAULT_RPC = "https:/polygon-rpc.com";

export const makeDefaultPolygonSigner = (privateKey: string) => {
    const provider = new JsonRpcProvider(DEFAULT_RPC, {
        chainId: POLYGON_CHAIN_ID,
        name: "polygon",
    });
    const wallet = new Wallet(privateKey, provider);
    return wallet;
};

/**
 * Randomly shuffles a deck using Chainlink VRF
 *
 * Returns information that clients can use to validate:
 * Methodology, randomness, time, and ownership of shuffle.
 */
export const zeroTrustShuffle = async (
    {
        forceContractReload,
        test,
        ...signerOrKey
    }: ({ signer: Signer } | { privateKey: string } | {}) & {
        forceContractReload?: boolean;
        test?: boolean;
    } = {
        forceContractReload: false,
    }
) => {
    // Ensure contracts are connected to
    if (!vrfContract || !linkContract || !!forceContractReload) {
        if ("signer" in signerOrKey) {
            loadContracts(signerOrKey.signer, !!test);
        } else if ("privateKey" in signerOrKey) {
            loadContracts(makeDefaultPolygonSigner(signerOrKey.privateKey));
        } else {
            throw new Error("Contracts must be loaded");
        }
    }

    // Generate a message to prove that we intiated this VRF call
    // Clients can validate later by signing the nonce "zero-trust-shuffle" with private key
    const proofOfOwnership = Wallet.createRandom();
    const proofOfOwnershipMessage =
        await proofOfOwnership.signMessage("zero-trust-shuffle");

    // Generate our random seed using Chainlink VRF on Polygon
    const { randomWord, requestId, hash } = await randomNumber(
        vrfContract,
        linkContract,
        proofOfOwnershipMessage
    );
    const seed = randomWord.toString();

    // Use Fisher-Yates to shuffle a deck using our hashed value
    const { cards: shuffledDeck, nonce: _nonce } = shuffleDeckFromHashedInputs(
        proofOfOwnership.privateKey,
        seed
    );

    return {
        gameStartReveal: {
            proofOfOwnershipMessage,
            seed,
            tx: {
                url: `https://polygonscan.com/tx/${hash}`,
                hash,
                vrfRequestId: requestId,
            },
        },
        gameEndReveal: {
            privateKey: proofOfOwnership.privateKey,
            shuffledDeck,
        },
        proofOfOwnershipWallet: proofOfOwnership,
        shuffledDeck,
    };
};
