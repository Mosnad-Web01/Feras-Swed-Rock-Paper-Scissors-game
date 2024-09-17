//Variables
const gameChoicesArray = ["Paper", "Scissors", "Rock"];
const rulesElement = document.querySelector(".container__rules");
const scoreNumberElement = document.querySelector(".header__scoreNumber");
const modalElement = document.querySelector(".modal");
const modalOverlayElement = document.querySelector(".modal__overlay");
const closeElement = document.querySelector(".modal__closeIcon");
const gameContentElement = document.querySelector(".gameContent");
const gameChoiceElements = document.querySelectorAll(
  ".gameContent__gameChoice"
);
const gameChoiceImageElement = document.querySelector(
  ".gameContent__gameChoiceImage"
);
const gameChoiceComputerElement = document.querySelector(
  ".gameContent__gameChoice--isComputer"
);
const countdownTextElement = document.querySelector(
  ".gameContent__countdownText"
);
const resultButtonElement = document.querySelector(
  ".gameContent__resultButton"
);
const resultTextElement = document.querySelector(".gameContent__resultText");
const player = document.querySelector("lottie-player"); //animation

let countdown = 4;
let randomResult;

// --- Functions ---

/**
 * Toggles the visibility of the rules modal.
 */
function toggleRulesModal() {
  modalElement.classList.toggle("modal--isActive");
}

/**
 * Generates a random number between 0 and 2.
 * @returns {number} A random number.
 */
function getRandomNumber() {
  return Math.floor(Math.random() * 3);
}

/**
 * Displays the game result after the countdown finishes.
 * @param {string} userChoice The player's choice.
 * @param {string} computerChoice The computer's choice.
 */
function showResult(userChoice, computerChoice) {
  const score = parseInt(scoreNumberElement.textContent);

  if (userChoice === computerChoice) {
    // Draw condition
    resultTextElement.textContent = "Draw";
  } else if (
    (userChoice === gameChoicesArray[0] &&
      computerChoice === gameChoicesArray[1]) ||
    (userChoice === gameChoicesArray[1] &&
      computerChoice === gameChoicesArray[2]) ||
    (userChoice === gameChoicesArray[2] &&
      computerChoice === gameChoicesArray[0])
  ) {
    // Lose conditions
    resultTextElement.textContent = "You lose";
    gameContentElement.classList.add("gameContent--isLost");

    if (score > 0) {
      scoreNumberElement.textContent = score - 1;
    }
  } else {
    // Win condition
    resultTextElement.textContent = "You win";
    setTimeout(
      () =>
        player.load(
          "https://assets10.lottiefiles.com/packages/lf20_aEFaHc.json"
        ),
      900
    );
    scoreNumberElement.textContent = score + 1;
  }

  // Save the score to local storage
  localStorage.setItem("score", scoreNumberElement.textContent);
}

/**
 * Starts the countdown before the game begins.
 */
function startCountdown() {
  countdownTextElement.textContent = countdown - 1; // Add countdown number to the HTML
  countdown -= 1;

  if (countdown) {
    // Start the countdown until we reach 0
    setTimeout(() => startCountdown(), 600);
  } else {
    // Select random choice and show it
    const selectedGameChoiceElement = document.querySelector(
      ".gameContent__gameChoice--isActive"
    );
    const selectedChoice = selectedGameChoiceElement.dataset.choice;
    randomResult = gameChoicesArray[getRandomNumber()];

    showResult(selectedChoice, randomResult);
    setTimeout(
      () => gameContentElement.classList.add(`gameContent--revealResult`),
      500
    ); // Delay the final result for half a second

    countdownTextElement.textContent = "";
    // Set the selected choice style
    gameChoiceComputerElement.classList.add(
      `gameContent__gameChoice--is${randomResult}`
    );
    // Set the selected choice image
    gameChoiceImageElement.setAttribute(
      "src",
      `./images/icon-${randomResult.toLowerCase()}.svg`
    );
    countdown = 4; // Reset the countdown number
  }
}

/**
 * Handles the game choice event when the user clicks a choice.
 * @param {Event} event The click event on the game choice.
 */
function handleGameChoice(event) {
  gameContentElement.classList.add("gameContent--isActive");
  event.target.classList.add("gameContent__gameChoice--isActive");

  startCountdown();
}

/**
 * Resets the game after a round is finished.
 */
function handlePlayAgain() {
  const activeChoiceElement = document.querySelector(
    ".gameContent__gameChoice--isActive"
  );

  gameContentElement.classList.remove(`gameContent--revealResult`);
  gameChoiceComputerElement.classList.remove(
    `gameContent__gameChoice--is${randomResult}`
  );
  gameChoiceImageElement.setAttribute("src", "");
  gameContentElement.classList.remove(
    "gameContent--isActive",
    "gameContent--isLost"
  );
  activeChoiceElement.classList.remove("gameContent__gameChoice--isActive");
}

// Load the score from local storage when the page loads
window.addEventListener("load", function () {
  const savedScore = localStorage.getItem("score");
  if (savedScore) {
    scoreNumberElement.textContent = savedScore;
  }
});

// --- Event Listeners ---

// Rules modal events
rulesElement.addEventListener("click", toggleRulesModal);
closeElement.addEventListener("click", toggleRulesModal);
modalOverlayElement.addEventListener("click", toggleRulesModal);

// Game choices events
gameChoiceElements.forEach((item) =>
  item.addEventListener("click", handleGameChoice)
);
resultButtonElement.addEventListener("click", handlePlayAgain);
