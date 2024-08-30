type Suit = "H" | "D" | "C" | "S"; // Hearts, Diamonds, Clubs, Spades
type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

// Combine the suits and ranks to form all card combinations
type Card = `${Rank}${Suit}`;

// Define the event  types to avoid name conflicts
type EventType =
  | "begin" // meme mise
  | "draw" // tirer
  // | "move"
  // | "end"
  // | "result"
  | "double"
  | "split"
  | "stand";

type Action = EventType | "bet_more" | "base_bet" | "begin_after_more_bet";

// Represents a single event in the game
interface GameEvent {
  eventType: EventType; // Renamed from 'type'
  card?: Card; // Card drawn, applicable if eventType is 'draw' or 'double'
  score?: number; // Score after the event
  isSoft?: boolean; // Whether the score is soft
  status?: string; // Status message
  spot?: string; // Spot or position related to the event
  bet?: string; // Bet associated with the event
  earned?: number; // Amount earned in 'result' event
  paid?: number; // Amount paid in 'result' event
}

// Represents the last bet placed by the player
interface LastBet {
  main: number[]; // An array of numbers representing the main bet amounts
}

// Represents the choices available to the player
interface Choices {
  hit: boolean; // Whether the player can hit
  stand: boolean; // Whether the player can stand
  double: boolean; // Whether the player can double
  split: boolean; // Whether the player can split
  surrender: boolean; // Whether the player can surrender
  insure: boolean; // Whether the player can insure
}

// Represents the configuration of the game
interface Config {
  chips: number[]; // Array of available chip values
  minBet: number; // Minimum bet amount
  maxBet: number; // Maximum bet amount
  maxHands: number; // Maximum number of hands
  maxSplits: number; // Maximum number of splits
}

// Represents the player's balance before and after an action
interface Balance {
  before: number; // Balance before the action
  after: number; // Balance after the action
}

// Represents the state of the Blackjack game
interface BlackjackState {
  events: GameEvent[]; // Array of events
  isOver: boolean; // Whether the game is over
  lastBet: LastBet; // Last bet details
  choices: Choices; // Available choices
  side: any[]; // Array of side data (type can be specified if known)
  config: Config; // Configuration details
  balance: Balance; // Balance details
}

type Position = { x: number; y: number };

const INITIAL_DECKS = 6;
const CARDS_PER_DECK = 52;

const CARD_COUNT_VALUES: Record<Rank, number> = {
  "2": 1,
  "3": 1,
  "4": 1,
  "5": 1,
  "6": 1, // Low cards
  "7": 0,
  "8": 0,
  "9": 0, // Neutral cards
  "10": -1,
  J: -1,
  Q: -1,
  K: -1,
  A: -1, // High cards
};

const BUTTON_POSITION: Record<Action, Position> = {
  begin: { x: 0.5514376996805112, y: 0.812004530011325 },
  stand: { x: 0.32720848056537105, y: 0.8108720271800679 },
  draw: { x: 0.44572158365261816, y: 0.8097395243488109 },
  double: { x: 0.5611237661351557, y: 0.8108720271800679 },
  split: { x: 0.6682725395732966, y: 0.812004530011325 },
  bet_more: { x: 0.446360153256705, y: 0.8108720271800679 },
  base_bet: { x: 0.34277620396600567, y: 0.8176670441676104 },
  begin_after_more_bet: { x: 0.6521739130434783, y: 0.810009878169246 },
};

function calculateRunningCount(cards: Card[], initial = 0): number {
  return cards.reduce((count, card) => {
    const rank = card.slice(0, -1) as Rank;

    const value = CARD_COUNT_VALUES[rank] || 0;

    return count + value;
  }, initial);
}

function calculateRemainingDecks(cardsPlayed: number) {
  const totalCards = INITIAL_DECKS * CARDS_PER_DECK;

  const cardsRemaining = totalCards - cardsPlayed;

  const decksRemaining = cardsRemaining / CARDS_PER_DECK;

  return decksRemaining;
}

function calculateTrueCount(rc: number, decks: number) {
  return rc / decks;
}

function getBettingAmount(trueCount: number) {
  if (trueCount > 1) {
    if (trueCount <= 2) return 1;
    if (trueCount <= 3) return 2;
    if (trueCount <= 4) return 3;

    return 4;
  }

  return 0;
}

window.onload = () => {
  console.log("Window loaded");

  const canvas = document.getElementById(
    "application-canvas"
  ) as HTMLCanvasElement;

  if (canvas) {
    canvas.addEventListener("click", (event) => {
      const coords = getRelativeCoordinates(event, canvas);
      console.log("Relative Coordinates onload:", coords);
    });
  } else {
    console.error('Canvas element with ID "application-canvas" not found.');
  }
};

function initCanvasEvents() {
  const canvas = document.getElementById(
    "application-canvas"
  ) as HTMLCanvasElement;
  if (canvas) {
    canvas.addEventListener("click", (event) => {
      const coords = getRelativeCoordinates(event, canvas);
      console.log("Relative Coordinates:", coords);
    });
  } else {
    console.error('Canvas element with ID "application-canvas" not found.');
  }
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      const canvas = document.getElementById(
        "application-canvas"
      ) as HTMLCanvasElement;

      if (canvas) {
        initCanvasEvents();
        observer.disconnect(); // Stop observing once canvas is initialized
      }
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

function clickAtPosition(position: Position, canvas: HTMLCanvasElement) {
  if (!canvas) {
    console.error("Canvas element not found.");
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const clientX = rect.left + position.x * canvas.width;
  const clientY = rect.top + position.y * canvas.height;

  console.log("Calculated clientX:", clientX, "clientY:", clientY);

  const event = new MouseEvent("click", {
    clientX: 604,
    clientY: 687,
    bubbles: true,
  });

  canvas.dispatchEvent(event);

  console.log("MouseEvent dispatched.");
}

let cardsPlayed = 0;
let remainingDecks = 0;
let runningCount = 0;
let trueCount = 0;
let amount = 0;

const realPosition = (pos: Position, canvas: HTMLCanvasElement) => ({
  x: pos.x * canvas.width,
  y: pos.y * canvas.height,
});

function updateState(state: BlackjackState) {
  const cards: Card[] = (state.events || [])
    .filter((e) => !!e?.card)
    .map((e) => e.card) as Card[];

  cardsPlayed += cards.length;
  remainingDecks = calculateRemainingDecks(cardsPlayed);

  runningCount = calculateRunningCount(cards, runningCount);
  trueCount = calculateTrueCount(runningCount, remainingDecks);
  amount = getBettingAmount(trueCount);

  console.log("Running count", runningCount);
  console.log("True count", trueCount);
  console.log("amount", amount);
}

function interceptXHR() {
  const originalXHR = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string,
    async: boolean = true,
    user?: string | null,
    password?: string | null
  ): void {
    if (url.includes("/gambling/play")) {
      this.addEventListener("load", function () {
        try {
          const state: BlackjackState = JSON.parse(this.responseText);
          console.log("State:", state);
          updateState(state);

          const canvas = document.getElementById(
            "application-canvas"
          ) as HTMLCanvasElement;

          if (canvas) {
            setTimeout(() => {
              clickAtPosition(BUTTON_POSITION.double, canvas);
            }, 4000);
          }

          // make action based on base strategy and available move
          // click with position, stock action and position in record
          // click amount of time to play
        } catch (e) {
          console.error("Failed to parse /gambling/play response:", e);
        }
      });
    }

    originalXHR.apply(this, [method, url, async, user, password]);
  };
}

console.log("Start playing!");

interceptXHR();

function getRelativeCoordinates(
  event: MouseEvent,
  canvas: HTMLCanvasElement
): Position {
  const rect = canvas.getBoundingClientRect();

  const relativeX = (event.clientX - rect.left) / rect.width;
  const relativeY = (event.clientY - rect.top) / rect.height;

  // const x = relativeX * canvas.width;
  // const y = relativeY * canvas.height;
  const x = relativeX;
  const y = relativeY;

  console.log(`Relative coordinates on canvas: (${x}, ${y})`);
  return { x, y };
}
