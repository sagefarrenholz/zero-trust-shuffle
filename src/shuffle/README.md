# Considerations in Card Sequence Generation

Converting a hash into a unbiased random card sequence is non-trivial. We must
traverse the hash drawing new positions for each card according to the
Fisher–Yates algorithm (using Durstenfeld's method). We must avoid bias in the
output due to the modulo operator.

# Implementation

1. Create a SHA-512 from the input. I picked 512 because it gives us some
   redundancy against modulo bias. We're going to treat our hash like an RNG
   function as you will see momentarily
2. Next we will need to maintain the state of where we are at within the hash
   string. We're going to "draw" numbers from this string by sliding a window
   across the number. We can do this with some bitwise operators.
3. We will keep drawing values in a diminishing range until we are out of cards
   left to put into the shuffled result.

# Modulo bias

To avoid modulo bias we will discard any result outside of our range. For
example, if we are drawing a number between 0-51 (first card to be inserted into
shuffled result), this requires 6 bits. However, 6 bits could result in a value
above 51, such as 60. These values from 52-63 are biased results and therefore
discarded. At most our probability to discard is when we are drawing for range
0-32, in which case we would still need 6 bits, thus our probability of discard
is `64-33 = 31 / 64 = 48.4%`. This means we shouldn't need more than one retry
on average.
