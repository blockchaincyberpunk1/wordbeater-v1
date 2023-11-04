// DOM Elements
const wordInput = document.querySelector('#word-input'); // Input field where the user types the words
const currentWord = document.querySelector('#current-word'); // Element to display the current word for the user to type
const scoreDisplay = document.querySelector('#score'); // Element to display the user's score
const timeDisplay = document.querySelector('#time'); // Element to display the remaining time
const message = document.querySelector('#message'); // Element to display messages like 'Correct!!!' or 'Game Over!!!'
const seconds = document.querySelector('#seconds'); // Element to display the time limit in seconds
const highscoreDisplay = document.querySelector('#highscore'); // Element to display the user's high score

// Available Levels - Defines the time limit for each level
const levels = {
  easy: 5,
  medium: 3,
  hard: 1
};

// To change level - Set the current level to 'medium'
const currentLevel = levels.medium;

// Variables to manage the game state
let time = currentLevel; // Remaining time for the user to type the word
let score = 0; // User's score
let isPlaying; // A flag to check if the game is currently active (true) or over (false)

// Word List - Contains a list of words that the user needs to type
const words = [
  'hat',
  'river',
  // (other words are listed here, truncated for brevity)
  'champion',
  'ghost',
  'fierce'
];

// Initialize Game - This function sets up the game when the page loads
function init() {
  // Show number of seconds in UI
  seconds.innerHTML = currentLevel;

  // Load word from the array and display it for the user to type
  showWord(words);

  // Start matching user input on the word input field
  wordInput.addEventListener('input', startMatch);

  // Call countdown function every second to update the remaining time
  setInterval(countdown, 1000);

  // Check the game status every 50 milliseconds
  setInterval(checkStatus, 50);
}

// Load More Words - Using Fetch API to fetch additional words from a file (words.txt)
async function loadMoreWords() {
  try {
    const response = await fetch("words.txt");
    if (!response.ok) {
      throw new Error('Failed to fetch words');
    }
    const text = await response.text();
    const loadedWords = text.split("\n").map(word => word.trim()); // Split the text by new lines and trim each word
    words.push(...loadedWords); // Add the loaded words to the existing words array
  } catch (error) {
    console.error(error);
  }
}

// Start match - This function is called when the user types a word
function startMatch() {
  if (matchWords()) {
    // If the user typed the correct word, update the game state
    isPlaying = true;
    time = currentLevel + 1;
    showWord(words);
    wordInput.value = '';
    score++;
  }

  // Highscore based on the score value stored in Local Storage
  const highscore = parseInt(localStorage.getItem('highscore')) || 0;
  if (score > highscore) {
    localStorage.setItem('highscore', score);
  }
  highscoreDisplay.innerHTML = localStorage.getItem('highscore') || 0;

  // If score is -1 (game over state), display 0
  if (score === -1) {
    scoreDisplay.innerHTML = 0;
  } else {
    scoreDisplay.innerHTML = score;
  }
}

// Match currentWord to wordInput - This function checks if the user's input matches the current word
function matchWords() {
  if (wordInput.value === currentWord.innerHTML) {
    // Display 'Correct!!!' message temporarily when the user types the correct word
    message.innerHTML = 'Correct!!!';
    setTimeout(() => {
      message.innerHTML = '';
    }, 1000);
    return true;
  } else {
    return false;
  }
}

// Pick & show random word - This function selects a random word from the word list and displays it for the user to type
function showWord(words) {
  // Make sure there are words to choose from
  if (words.length === 0) {
    console.error("No words available to display.");
    return;
  }
  const randIndex = Math.floor(Math.random() * words.length);
  currentWord.innerHTML = words[randIndex];
}

// Countdown timer - This function decrements the remaining time every second
function countdown() {
  if (time > 0) {
    time--;
  } else if (time === 0) {
    // If the time is up, set the isPlaying flag to false (game over state)
    isPlaying = false;
  }
  // Show the updated time in the UI
  timeDisplay.innerHTML = time;
}

// Check game status - This function checks if the game is over (no time left and not currently playing)
function checkStatus() {
  if (!isPlaying && time === 0) {
    // If the game is over, display 'Game Over!!!' message and set the score to -1 (to prevent further increase)
    message.innerHTML = 'Game Over!!!';
    score = -1;
  }
}

// Call loadMoreWords to fetch additional words from the file (words.txt)
loadMoreWords();

// Initialize the game when the page loads
init();
