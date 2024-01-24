import * as crypto from "crypto";

// Offsets the hash and returns a value from 0 - upperBound
export const getRngValueFromHash = (
    hash: bigint,
    offset: number, // Advance the hash to prevent duplicate outputs
    upperBound: number, // Prevents modulo bias by repicking if values are outside range, upper bound is exclusive
    maxRetry = 20 // Max retry attempts
) => {
    // Bitshift the hash
    let offsetHash = hash >> BigInt(offset);

    // Calculates minimum number of bits to contain upperBound
    let minimumBits = 1;
    while (2 ** minimumBits <= upperBound) {
        minimumBits++;
    }

    // Bit mask to isolate the bits we want
    const mask = 2 ** minimumBits - 1;

    // Continuously mask and shift if the value falls outside the range
    for (let i = 0; i < maxRetry; i++) {
        const maskedValue = offsetHash & BigInt(mask);
        if (maskedValue < upperBound) {
            return Number(maskedValue);
        }
        offsetHash >>= BigInt(offset + (1 + i) * minimumBits);
    }

    throw new Error("Exceeded max retries");
};

// Generates the hash from the given elements
export const hashValueFromElements = (...elements: string[]): bigint => {
    const hash = crypto
        .createHash("sha512")
        .update(elements.join())
        .digest("hex");
    return BigInt("0x" + hash);
};
