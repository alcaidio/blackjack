type Suit = 'H' | 'D' | 'C' | 'S'; // Hearts, Diamonds, Clubs, Spades
type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

// Combine the suits and ranks to form all card combinations
type Card = `${Rank}${Suit}`;

// Define the event types to avoid name conflicts
type EventType = 'begin' | 'draw' | 'move' | 'end' | 'result' | 'double' | 'stand';

// Represents a single event in the game
interface GameEvent {
    eventType: EventType; // Renamed from 'type'
    card?: Card;    // Card drawn, applicable if eventType is 'draw' or 'double'
    score?: number; // Score after the event
    isSoft?: boolean; // Whether the score is soft
    status?: string; // Status message
    spot?: string;   // Spot or position related to the event
    bet?: string;    // Bet associated with the event
    earned?: number; // Amount earned in 'result' event
    paid?: number;   // Amount paid in 'result' event
}

// Represents the last bet placed by the player
interface LastBet {
    main: number[]; // An array of numbers representing the main bet amounts
}

// Represents the choices available to the player
interface Choices {
    hit: boolean;     // Whether the player can hit
    stand: boolean;   // Whether the player can stand
    double: boolean;  // Whether the player can double
    split: boolean;   // Whether the player can split
    surrender: boolean; // Whether the player can surrender
    insure: boolean;  // Whether the player can insure
}

// Represents the configuration of the game
interface Config {
    chips: number[];  // Array of available chip values
    minBet: number;   // Minimum bet amount
    maxBet: number;   // Maximum bet amount
    maxHands: number; // Maximum number of hands
    maxSplits: number; // Maximum number of splits
}

// Represents the player's balance before and after an action
interface Balance {
    before: number;   // Balance before the action
    after: number;    // Balance after the action
}

// Represents the state of the Blackjack game
interface BlackjackState {
    events: GameEvent[];  // Array of events
    isOver: boolean;  // Whether the game is over
    lastBet: LastBet; // Last bet details
    choices: Choices; // Available choices
    side: any[];      // Array of side data (type can be specified if known)
    config: Config;   // Configuration details
    balance: Balance; // Balance details
}