"use strict";
const INITIAL_DECKS = 6;
const CARDS_PER_DECK = 52;
const CARD_COUNT_VALUES = {
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
const BUTTON_POSITION = {
    begin: { x: 0.5514376996805112, y: 0.812004530011325 },
    stand: { x: 0.32720848056537105, y: 0.8108720271800679 },
    draw: { x: 0.44572158365261816, y: 0.8097395243488109 },
    double: { x: 0.5611237661351557, y: 0.8108720271800679 },
    split: { x: 0.6682725395732966, y: 0.812004530011325 },
    bet_more: { x: 0.446360153256705, y: 0.8108720271800679 },
    base_bet: { x: 0.34277620396600567, y: 0.8176670441676104 },
    begin_after_more_bet: { x: 0.6521739130434783, y: 0.810009878169246 },
};
function calculateRunningCount(cards, initial = 0) {
    return cards.reduce((count, card) => {
        const rank = card.slice(0, -1);
        const value = CARD_COUNT_VALUES[rank] || 0;
        return count + value;
    }, initial);
}
function calculateRemainingDecks(cardsPlayed) {
    const totalCards = INITIAL_DECKS * CARDS_PER_DECK;
    const cardsRemaining = totalCards - cardsPlayed;
    const decksRemaining = cardsRemaining / CARDS_PER_DECK;
    return decksRemaining;
}
function calculateTrueCount(rc, decks) {
    return rc / decks;
}
function getBettingAmount(trueCount) {
    if (trueCount > 1) {
        if (trueCount <= 2)
            return 1;
        if (trueCount <= 3)
            return 2;
        if (trueCount <= 4)
            return 3;
        return 4;
    }
    return 0;
}
window.onload = () => {
    console.log("Window loaded");
    const canvas = document.getElementById("application-canvas");
    if (canvas) {
        canvas.addEventListener("click", (event) => {
            const coords = getRelativeCoordinates(event, canvas);
            console.log("Relative Coordinates onload:", coords);
        });
    }
    else {
        console.error('Canvas element with ID "application-canvas" not found.');
    }
};
function initCanvasEvents() {
    const canvas = document.getElementById("application-canvas");
    if (canvas) {
        canvas.addEventListener("click", (event) => {
            const coords = getRelativeCoordinates(event, canvas);
            console.log("Relative Coordinates:", coords);
        });
    }
    else {
        console.error('Canvas element with ID "application-canvas" not found.');
    }
}
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
            const canvas = document.getElementById("application-canvas");
            if (canvas) {
                initCanvasEvents();
                observer.disconnect(); // Stop observing once canvas is initialized
            }
        }
    });
});
observer.observe(document.body, { childList: true, subtree: true });
function clickAtPosition(position, canvas) {
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
const realPosition = (pos, canvas) => ({
    x: pos.x * canvas.width,
    y: pos.y * canvas.height,
});
function updateState(state) {
    const cards = (state.events || [])
        .filter((e) => !!(e === null || e === void 0 ? void 0 : e.card))
        .map((e) => e.card);
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
    XMLHttpRequest.prototype.open = function (method, url, async = true, user, password) {
        if (url.includes("/gambling/play")) {
            this.addEventListener("load", function () {
                try {
                    const state = JSON.parse(this.responseText);
                    console.log("State:", state);
                    updateState(state);
                    const canvas = document.getElementById("application-canvas");
                    if (canvas) {
                        setTimeout(() => {
                            clickAtPosition(BUTTON_POSITION.double, canvas);
                        }, 4000);
                    }
                    // make action based on base strategy and available move
                    // click with position, stock action and position in record
                    // click amount of time to play
                }
                catch (e) {
                    console.error("Failed to parse /gambling/play response:", e);
                }
            });
        }
        originalXHR.apply(this, [method, url, async, user, password]);
    };
}
console.log("Start playing!");
interceptXHR();
function getRelativeCoordinates(event, canvas) {
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
