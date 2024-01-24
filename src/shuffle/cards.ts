export enum Rank {
    ACE = "ace",
    TWO = "two",
    THREE = "three",
    FOUR = "four",
    FIVE = "five",
    SIX = "six",
    SEVEN = "seven",
    EIGHT = "eight",
    NINE = "nine",
    TEN = "ten",
    JACK = "jack",
    QUEEN = "queen",
    KING = "king",
}

export enum Suit {
    HEARTS = "hearts",
    CLUBS = "clubs",
    DIAMONDS = "diamonds",
    SPADES = "spades",
}

export type Card = {
    suit: Suit;
    rank: Rank;
};

// Returns a deck in a common brand new deck order
export const defaultDeck = (): Card[] => {
    return Object.values(Suit).flatMap<Card>((suit) => {
        return Object.values(Rank).map<Card>((rank) => {
            return {
                rank,
                suit,
            };
        });
    });
};
