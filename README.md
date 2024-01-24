# Motivation

Online card games need a verifiable and fair shuffling system that gives the
same or greater trust versus a real-life dealer.

An ideal solution:

1. Verifiably random, participants can trust the randomness not to be
   manipulated
2. Hides cards unless shown by the dealer. Showing the deck before hand would
   not work for most card games.

# Solution

I've laid out what I feel is a reliable and elegant solution to this problem.
There are caveats that you should be aware of ([see Caveats](#Caveats)):

1. The dealer / server generates a public-private key pair
2. The server then generates a verifiably random `public_seed` using an
   immutable contract on a blockchain. The server should distribute the
   transaction hash to game participants before game start so they can see the
   `public_key` and `public_seed` generated, as well as contract code.
3. Combine the `private_key` and `public_seed` into a single string and generate
   a hash.
4. Take the hash and map it to a shuffled deck. This is done by using a modulus
   operation.
5. Play the game.
6. After the game ends, distribute the `private_key` and a copy of the card
   sequence. This allows players to validate the hash function and that the
   original seed transaction was signed before the game using this
   `private_key`.

# Validation

The client can validate the process with a few simple checks:

1. Using the private key we can validate the public key on the transaction hash
2. Using the transaction hash we can validate the immutable contract used for
   randomness
3. Using the time we received the transaction hash we can verify that card
   sequence was the same generated when the game began
4. Using the seed and private key we can verify the open source hash function
   and mapping code is the same used to produce the card sequence

# Caveats

## Collusion

This system is not collusion proof. Because the dealer has the entire card
sequence they can cheat by playing themselves or secretly revealing the sequence
to others. Considering that real world casinos require that you trust the house
not to collude with players, I believe this system is on par.

Ideas on reducing collusion:

1. Financial incentives for server owners to not collude with players, or play
   themselves.
2. Generating seeds for each card rather than the entire deck (more costly,
   higher latency)
3. KYC layer that prevents certain players
4. Consistent audits of server
5. Limit lifetime and accessibility of keys on the server

## Transparency

This system assumes that the dealer is transparent about the transaction hash
before the game begins and their private key and card sequence after.
Withholding information, for any amount of time, could inhibit the validity of
this system. For instance, if the dealer withholds the transaction hash until
the end of the game, they could, theoretically, create a sequence of cards then
brute-force inputs until they create a hash function input that satisfies the
originally provided sequence
