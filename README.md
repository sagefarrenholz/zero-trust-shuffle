![tinyCard](https://github.com/sagefarrenholz/zero-trust-shuffle/assets/46610156/1b7fc144-ac99-411d-b223-9e20abb35aa4)

[![npm version](https://badge.fury.io/js/zero-trust-shuffle.svg)](https://badge.fury.io/js/zero-trust-shuffle)

An open source zero-trust way to shuffle a deck of cards. Allowing players to
have certifiable knowledge of fairness for gameplay online.

# Usage

```sh
npm install zero-trust-shuffle
```


or with yarn:

```sh
yarn add zero-trust-shuffle
```

You'll need to a polygon wallet that can pay for the gas (Each call is around
250k gas), you'll also need some Link (non-bridged). All in all each call comes
out a few cents.

In order to acquire non-bridged LINK on polygon you'll need to take your bridged
LINK here and swap it:
[PegSwap Bridged Link to Unbridged](https://pegswap.chain.link/)

Once you have your funded wallet, here's how you might use `zero-trust-shuffle`:

```typescript
import { zeroTrustShuffle } from "zero-trust-shuffle";

const FUNDED_WALLET_PRIVATE_KEY = "0x...";

const exampleUsage = async () => {
    const { gameStartReveal, gameEndReveal, shuffledDeck } =
        await zeroTrustShuffle({ privateKey: FUNDED_WALLET_PRIVATE_KEY });

    // On game start reveal non-secret information to clients
    sendClients(gameStartReveal);

    // Play card based game
    playPoker(shuffledDeck);

    // On game end reveal game secrets to clients
    sendClients(gameEndReveal);
};
```

Passing your key is only needed in the first call to `zeroTrustShuffle()`. Any
further calls will reuse that key:

```ts
// Subsequent deck shuffle
const { gameStartReveal, gameEndReveal, shuffledDeck } =
    await zeroTrustShuffle();
```

# VRF Polygon Contracts

Contracts are deployed on Polygon for VRF functionality. Feel free to use these.
To invoke them, call `transferAndCall` on the Link token contract with 0.001
Link.

Mumbai Testnet ->
[0x1AC8A22D9EF30069f15942451B6291de550B267F](https://mumbai.polygonscan.com/address/0x1AC8A22D9EF30069f15942451B6291de550B267F)
\
Polygon Mainnet -> [0x14178335e9323F92dcA7C48cf64Bab835d2AC8EC](https://polygonscan.com/address/0x14178335e9323F92dcA7C48cf64Bab835d2AC8EC#code)
