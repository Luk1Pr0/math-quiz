// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timedown;
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0s";

// Scroll
let valueY = 0;

function playAgain() {
  gamePage.addEventListener("click", startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  playAgainBtn.hidden = true;
  valueY = 0;
}

// Show score page after finishing game page
function showScorePage() {
  // show play again button after 1 second
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 2000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Format the time and display it in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  // Scroll to top of the item container and go to score page
  itemContainer.scrollTo({ top: 0, behaviour: "instant" }) 
  showScorePage();
}

// Stop timer and process results and go to the score page
function checkTime() {
  if (playerGuessArray.length == questionAmount) {
    console.log("player Guess array", playerGuessArray);
    clearInterval(timer);
    // Loop through and check for wrong guesses + add penalty time
    equationsArray.forEach((equation, i) => {
      if (equation.evaluated === playerGuessArray[i]) {
        // Correct guess, no penalty
      } else {
        // Incorrect guess, add 0.5s penalty
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    console.log("time played", timePlayed, "penalty", penaltyTime, "final:", finalTime);
    scoresToDOM();
  }
} 

// Add a tenth of a second to timePlayed
function addTime() {
  console.log("time played", timePlayed);
  timePlayed += 0.1;
  checkTime();
}

// Start timer when game page is clicked
function startTimer() {
  // Reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}

// Scroll and store user selectin in the playerGuess array
function select(guessedTrue) {
  // Scroll 80px each time the button is pressed
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to the array
  return guessedTrue ? playerGuessArray.push("true") : playerGuessArray.push("false");
}

// Show game page 
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
  clearInterval(timeDown);
}

// Get random number up to a max number
function getRandomNum(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomNum(questionAmount);
  console.log("correct equ", correctEquations);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log("wrong equ", wrongEquations);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomNum(11);
    secondNumber = getRandomNum(11);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomNum(11);
    secondNumber = getRandomNum(11);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomNum(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// Add equations to DOM
function equationsToDOM() {
  equationsArray.forEach(equation => {
    // Create item
    const item = document.createElement("div");
    item.classList.add("item");
    // Equation text
    const equationText = document.createElement("h1");
    equationText.textContent = equation.value;
    // Append elements into DOM
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  })
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);
  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// Display 3, 2, 1 countdown
function countdownStart() {
  countdown.textContent = "3";
  let seconds = 2;
  timeDown = setInterval(() => {
    // Only countdown if seconds is equal to or larger than 0
    if (seconds >= 0) {
      countdown.textContent = seconds--;
      console.log(seconds);
    }
    // Once seconds reach -1 then change the 0 to Go!
    if (seconds === -1) {
      countdown.textContent = "Go!";
      seconds = 2;
      // console.log("seconds", seconds);
      console.log(seconds);
    }
  }, 1000);
}

// Navigate from splashpage to countdown page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 4000);
}

// Get value of the selected radio button
function getRadioValue() {
  let radioValue;
  radioInputs.forEach(radioInput => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// Form that decied the amount of questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log("Question Amount:", questionAmount);
  if (questionAmount) {
    showCountdown();
  }
}

// Event listeners
startForm.addEventListener("click", () => {
  radioContainers.forEach(radioEl => {
    // Remove selected label styling
    radioEl.classList.remove("selected-label");
    // Add selected label back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add("selected-label");
    }
  });
});

startForm.addEventListener("submit", selectQuestionAmount);
gamePage.addEventListener("click", startTimer);