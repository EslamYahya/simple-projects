/*
  Advices
  - Always Check The Console
  - Take Your Time To Name The Identifiers
  - DRY

  Steps To Create The Project
  [01] Create HTML Markup
  [02] Add Styling And Separate From Logic
  [03] Create The App Logic
  ---- [01] Add Levels
  ---- [02] Show Level And Seconds
  ---- [03] Add Array Of Words
  ---- [04] ِAdd Start Game Button
  ---- [05] Generate Upcoming Words
  ---- [06] Disable Copy Word And Paste Event + Focus On Input
  ---- [07] Start Play Function
  ---- [08] Start The Time And Count Score
  ---- [09] Add The Error And Success Messages
  [04] Your Trainings To Add Features
  ---- [01] Save Score To Local Storage With Date
  ---- [02] Choose Levels From Select Box
  ---- [03] Break The Logic To More Functions
  ---- [04] Choose Array Of Words For Every Level
  ---- [05] Write Game Instruction With Dynamic Values
  ---- [06] Add 3 Seconds For The First Word
*/

// Arrays Of Words For Each Level
const easyWords = ["Hello", "Town", "Country", "Test", "Rust"];
const normalWords = ["Programming", "Code", "Javascript", "Testing", "Youtube", "Linkedin", "Twitter", "Github", "Leetcode", "Internet"];
const hardWords = ["Destructuring", "Paradigm", "Documentation", "Dependencies", "Runner", "Roles", "Playing"];

// Setting Levels
const lvls = { "Easy": 5, "Normal": 3, "Hard": 2 };

// Default Level
let defaultLevelName = "Normal";
let defaultLevelSeconds = lvls[defaultLevelName];
let words = getWordsForLevel(defaultLevelName);
let usedWords = [];
let gameInterval = null;

// Catch Selectors
let startButton = document.querySelector(".start");
let lvlNameSpan = document.querySelector(".message .lvl");
let secondsSpan = document.querySelector(".message .seconds");
let theWord = document.querySelector(".the-word");
let upcomingWords = document.querySelector(".upcoming-words");
let input = document.querySelector(".input");
let timeLeftSpan = document.querySelector(".time span");
let scoreGot = document.querySelector(".score .got");
let scoreTotal = document.querySelector(".score .total");
let finishMessage = document.querySelector(".finish");
let levelSelect = document.getElementById("level-select");

// Set Level Based on Selection
levelSelect.onchange = function () {
  defaultLevelName = this.value;
  defaultLevelSeconds = lvls[defaultLevelName];
  lvlNameSpan.innerHTML = defaultLevelName;
  secondsSpan.innerHTML = defaultLevelSeconds;
  timeLeftSpan.innerHTML = defaultLevelSeconds;
  words = getWordsForLevel(defaultLevelName);
  scoreTotal.innerHTML = words.length;
  updateGameInstructions();
};

// Disable Paste Event
input.onpaste = () => false;

// Start Game
startButton.onclick = function () {
  this.remove();
  input.focus();
  startGame();
  levelSelect.style.display = 'none';
};
function startGame() {
  resetGame();
  genWords();
}

function resetGame() {
  clearInterval(gameInterval);
  scoreGot.innerHTML = 0;
  finishMessage.innerHTML = '';
  words = getWordsForLevel(defaultLevelName);
  usedWords = [];
  levelSelect.style.display = 'block';
  isFirstWord = true;
}
function getWordsForLevel(level) {
  switch (level) {
    case "Easy": return [...easyWords];
    case "Normal": return [...normalWords];
    case "Hard": return [...hardWords];
    default: return [...normalWords];
  }
}

function genWords() {
  if (words.length === 0) {
    endGame("Congrats, You Won!", "good");
    return;
  }

  let randomWord = getRandomWord();
  theWord.innerHTML = randomWord;
  upcomingWords.innerHTML = '';
  displayUpcomingWords();
  startPlay();
}

function getRandomWord() {
  let randomIndex = Math.floor(Math.random() * words.length);
  let word = words[randomIndex];
  words.splice(randomIndex, 1);
  usedWords.push(word);
  return word;
}

function displayUpcomingWords() {
  upcomingWords.innerHTML = "";
  words.forEach(word => {
    let div = document.createElement("div");
    div.textContent = word;
    upcomingWords.appendChild(div);
  });
}

function startPlay() {
  let extraTime = isFirstWord ? 3 : 0;
  isFirstWord = false;

  timeLeftSpan.innerHTML = defaultLevelSeconds + extraTime;

  gameInterval = setInterval(() => {
    updateTimer();
  }, 1000);
}

function updateTimer() {
  timeLeftSpan.innerHTML--;
  if (parseInt(timeLeftSpan.innerHTML) === 0) {
    clearInterval(gameInterval);
    checkWordMatch();
  }
}

function checkWordMatch() {
  if (theWord.innerHTML.toLowerCase() === input.value.toLowerCase().trim()) {
    handleCorrectWord();
  } else {
    handleIncorrectWord();
  }
}

function handleCorrectWord() {
  input.value = '';
  scoreGot.innerHTML++;
  genWords();
}

function handleIncorrectWord() {
  endGame("Game Over", "bad");
}

function endGame(message, className) {
  clearInterval(gameInterval);
  displayFinishMessage(message, className);
  saveScoreToLocalStorage(scoreGot.innerHTML);
  levelSelect.style.display = 'block';
}

function displayFinishMessage(message, className) {
  finishMessage.innerHTML = `<span class="${className}">${message}</span>`;
}

function updateGameInstructions() {
  document.querySelector(".instructions").innerHTML =
    `You are playing on <strong>${defaultLevelName}</strong> level. You have <strong>${defaultLevelSeconds}</strong> seconds to type each word. Good luck!`;
}

function saveScoreToLocalStorage(score) {
  const currentDate = new Date().toLocaleString();
  const scoreData = { score: score, date: currentDate };
  localStorage.setItem('typingGameScore', JSON.stringify(scoreData));
}
