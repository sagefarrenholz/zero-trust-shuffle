import { RngFunction, fisherYates } from "./fisherYates";
import { getRngValueFromHash, hashValueFromElements } from "./hashRNG";

// Given an arbitrary list of strings, generate a hash that will be used
// to create a list random numbers. Use this list to pick cards out of
// a deck and restack them (shuffling).
// If this process fails, increment a nonce to generate a new hash.
const shuffleDeckFromHashedInputs = (...inputs: string[]) => {
    let nonce = 0;
    while (true) {
        try {
            const hash = hashValueFromElements(...inputs, nonce.toFixed());
            const rngFn: RngFunction = (upper, iter) =>
                getRngValueFromHash(hash, iter, upper);
            return fisherYates(rngFn);
        } catch (e) {
            nonce++;
        }
    }
};

export default shuffleDeckFromHashedInputs;
