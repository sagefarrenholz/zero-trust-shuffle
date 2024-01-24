import { Card, defaultDeck } from "./cards";

// Cards in a deck
const MAX_CARDS = 52;

export type RngFunction = (upperBound: number, iteration: number) => number;

// Given the random number generator function, shuffles a deck of cards
export const fisherYates = (rngFn: RngFunction): Card[] => {
    const startingDeck = defaultDeck();
    const shuffledDeck: Card[] = [];

    for (let i = 0; i < MAX_CARDS; i++) {
        if (i === MAX_CARDS - 1) {
            shuffledDeck.push(startingDeck[0]);
            console.log({
                lastCard: startingDeck[0],
            });
            break;
        }

        const randomVal = rngFn(MAX_CARDS - i, i);
        console.log({
            selectedCard: startingDeck[randomVal],
            randomVal,
        });
        shuffledDeck.push(startingDeck[randomVal]);
        const poppedCard = startingDeck.pop();
        // If the last card is not chosen we know the popped card will be defined
        if (randomVal !== MAX_CARDS - i - 1) {
            startingDeck[randomVal] = poppedCard!;
        }
    }

    return shuffledDeck;
};
