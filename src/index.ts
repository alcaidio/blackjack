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

function calculateRunningCount(cards: Card[]): number {
  return cards.reduce((count, card) => {
    const rank = card.slice(0, -1) as Rank;

    const value = CARD_COUNT_VALUES[rank] || 0;

    return count + value;
  }, 0);
}

function calculateRemainingDecks(cardsPlayed: number): number {
    const totalCards = INITIAL_DECKS * CARDS_PER_DECK;
    
    const cardsRemaining = totalCards - cardsPlayed;
    
    const decksRemaining = cardsRemaining / CARDS_PER_DECK;
    
    return decksRemaining;
}

let cardsPlayed = 0

function updateState(state: BlackjackState) {
    const cards: Card[] = (state.events || []).map((e) => e?.card);
    cardsPlayed += cards.length

    const RC = calculateRunningCount(cards);
    const remainingDecks = calculateRemainingDecks(cardsPlayed);
    const TC = RC / remainingDecks

    console.log("Running count", RC);
    console.log("True count", TC);
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
        const state: BlackjackState = JSON.parse(this.responseText);

        updateState(state);
      });
    }

    originalXHR.apply(this, [method, url, async, user, password]);
  };
}

interceptXHR();
