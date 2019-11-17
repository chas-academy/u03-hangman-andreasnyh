/* eslint-disable require-jsdoc */
// ###################### Global variables ######################### //

let selectedWord = ''; // String: The chosen randomized word
let letterIndex = []; // Array: Positions of correctly guessed letters

let rightGuesses = 0; // Number: Correct guesses
let guesses = 0; // Number: Wrong guesses

// DOM-node: Container of hangman image
const hangmanImg = document.getElementById('hangman');
// DOM-node: Container of win/lose message
const msgHolderEl = document.getElementById('message');
// DOM-node: Start button
const startGameBtnEl = document.getElementById('startGameBtn');
// Array of DOM-nodes: A-Ö letter buttons
const letterButtonEls = document.querySelectorAll('#letterButtons button');
// Array of DOM-nodes: Container for number of boxes = selectedWord.length
const letterBoxEls = document.querySelector('#letterBoxes > ul');

// Constant with function to filter keyboard presses to only 'A-Ö'
const keyListener = function() {
  if (
    (event.keyCode >= 65 && event.keyCode <= 90) || // a - z
    event.keyCode === 192 || // ö
    event.keyCode === 221 || // å
    event.keyCode === 222 // ä
  ) {
    checkLetterValue2(selectedWord, event, event.key);
  }
};

// #################### Get words from file #################### //

// Get array of words from file
let wordsFromTxt = null;
// const urlEng = '../assets/words.txt'; // English words to be implemented
const urlSwe = '../assets/wordsSWE.txt';

const xhr = new XMLHttpRequest();
xhr.open('GET', urlSwe, false);
/* False turns off asynchronous behaviour
lets us do just one .send() and get all the words
*/
xhr.onload = function() {
  // wordsFromTxt = xhr.responseText;
  wordsFromTxt = xhr.responseText.toUpperCase();
  wordsFromTxt = wordsFromTxt.split('\n');
  // console.log(wordsFromTxt);
};
xhr.send();

wordsFromTxt = wordsFromTxt.filter((item) => !item.includes('á'));
wordsFromTxt = wordsFromTxt.filter((item) => !item.includes('é'));
wordsFromTxt = wordsFromTxt.filter((item) => !item.includes('ó'));
wordsFromTxt = wordsFromTxt.filter((item) => !item.includes('ü'));
wordsFromTxt = wordsFromTxt.filter((item) => !item.includes('\''));
wordsFromTxt = wordsFromTxt.filter((item) => !item.includes('.'));

// Save wordsFromText items, that does not include '-' and the above in wordList
const wordList = wordsFromTxt.filter((item) => !item.includes('-'));

// #################### Functions and Listeners #################### //

disableLetters(); // Disable letter-buttons on load

// Listen for clicks on start-button and keyboard
startGameBtnEl.addEventListener('click', startGame);
document.addEventListener('keydown', keyListener);

function startGame() {
  startGameBtnEl.innerHTML = 'Slumpa nytt ord';
  enableLetters();
  generateRandomWord();
  createLetterBoxes();
}

// Get a random word from wordList
function generateRandomWord() {
  selectedWord = wordList[Math.floor(Math.random() * wordList.length)];
  // console.log(selectedWord);
  return selectedWord;
}

// Creates boxes for the individual letters in the selected word
function createLetterBoxes() {
  letterBoxEls.innerHTML = ''; // Reset boxes

  /*
  For the length of the word
  Create a list-element containing an input
  Append them to letterBoxEls (ul)
  */
  for (let i = 0; i < selectedWord.length; i++) {
    const liEl = document.createElement('li');
    const liElInput = document.createElement('input');
    liElInput.setAttribute('type', 'text');
    // liElInput.setAttribute("value", selectedWord[i]);
    liElInput.setAttribute('placeholder', '__');
    liElInput.setAttribute('disabled', '');
    liEl.appendChild(liElInput); // make the input a child of the list-element
    letterBoxEls.appendChild(liEl); // make list and input a child of letterbox
  }
}

// Creates the message on win/lose
// Message fed from youWon/gameOver functions
function createMessage(message) {
  const msgArticle = document.createElement('article');
  const msgHeading = document.createElement('h2');
  const msgParagraph = document.createElement('p');

  const msgBtnDiv = document.createElement('div'); // Button container
  const msgBtnYes = document.createElement('input'); // Restart? Yes-button
  const msgBtnNo = document.createElement('input'); // Restart? No-button

  msgArticle.setAttribute('id', 'messageArticle');

  msgHeading.innerText = message; // win or loose message
  msgParagraph.innerText = 'Vill du spela igen?';
  msgArticle.appendChild(msgHeading); // Append heading to article
  msgArticle.appendChild(msgParagraph); // Append paragraph to article
  msgHolderEl.appendChild(msgArticle); // Append article to message container

  msgBtnDiv.setAttribute('class', 'messageBtnDiv');

  // Attributes of Yes button
  msgBtnYes.setAttribute('type', 'button');
  msgBtnYes.setAttribute('id', 'btnYes');
  msgBtnYes.setAttribute('class', 'restartBtn btn btn--stripe');
  msgBtnYes.setAttribute('value', 'JA');

  // Attributes of no button
  msgBtnNo.setAttribute('type', 'button');
  msgBtnNo.setAttribute('class', 'restartBtn btn btn--stripe');
  msgBtnNo.setAttribute('value', 'NEJ');

  msgBtnDiv.appendChild(msgBtnYes); // Append buttons to container
  msgBtnDiv.appendChild(msgBtnNo);
  msgArticle.appendChild(msgBtnDiv); // Append button container to article

  // Snow message element
  msgHolderEl.style.visibility = 'visible';

  // Make the yes-button take focus to be able to restart game with Enter-key
  document.getElementById('btnYes').focus();

  // Listen to yes to restart the game
  msgBtnYes.addEventListener('click', function() {
    reset();
  });

  // Listen to no to leave the game
  msgBtnNo.addEventListener('click', function() {
    window.location = 'https://chasacademy.se/';
  });
}

function youWon() {
  // Remove listeners for keyboard
  document.removeEventListener('keydown', keyListener);
  disableLetters(); // Disable letter-buttons
  createMessage('Du vann!'); // Create Message overlay
}

function gameOver() {
  // Remove listeners for keyboard
  document.removeEventListener('keydown', keyListener);
  disableLetters(); // Disable letter-buttons
  displayWord(); // Show the word
  createMessage('Bättre lycka nästa gång'); // Create Message overlay
}

function enableLetters() {
  letterButtonEls.forEach((letter) => {
    letter.disabled = false;
  });
}

function disableLetters() {
  letterButtonEls.forEach((letter) => {
    letter.disabled = true;
  });
}

// Reset game after win/lose
function reset() {
  msgHolderEl.style.visibility = 'hidden';
  msgHolderEl.innerHTML = '';
  startGameBtnEl.disabled = false;
  startGameBtnEl.innerHTML = 'Starta spelet';
  rightGuesses = 0;
  guesses = 0;
  hangmanImg.src = `images/h${guesses}.png`;
  enableLetters();
  startGame();
  document.addEventListener('keydown', keyListener);
}

// Listen to clicks on letters
letterButtonEls.forEach((letter) => {
  letter.addEventListener('click', function() {
    checkLetterValue2(selectedWord, letter, letter.value);
  });
});

// Check if letter matches letter in word(selectedWord, event, event.key)
function checkLetterValue2(word, letter, letterValue) {
  const selectedWordArray = word.split(''); // split word into array
  startGameBtnEl.disabled = true; // disable start button to lock word
  // Make letterValue uppercase to match with letter-buttons.value
  letterValue = letterValue.toUpperCase();

  /*
  Letter exists
  Guesses lower than six
  Right guesses not equal to length of word
  */
  if (
    selectedWordArray.includes(letterValue) === true &&
    guesses < 6 &&
    selectedWordArray.length !== rightGuesses
  ) {
    /*
    For each letter-button
    Check if button has been disabled
    to stop being able to press the same
    correct key multiple times on the keyboard
    */
    letterButtonEls.forEach((letterButton) => {
      // if correct letter && button not disabled
      if (
        letterButton.value === letterValue &&
        letterButton.disabled === false
      ) {
        // Disable the button
        letterButton.disabled = true;

        /*
        Returns an array of positions in selectedWordArray
        where letterValue is present
        */
        getLetterIndex(selectedWordArray, letterValue);

        // Loop to display correctly guessed letters
        for (let i = 0; i < letterIndex.length; i++) {
          const pos = letterIndex[i];
          // Assign the correct input the value of the guessed letter
          letterBoxEls.childNodes[pos].firstChild.value = letterValue;
        }

        // Update the number of correct guesses
        rightGuesses = rightGuesses + letterIndex.length;

        // log guessed letter and number of right guesses
        console.log(
            `You guessed: ${letterValue} for a total`,
            `of ${rightGuesses} correct guesses.`,
        );

        // Internal if to check if WIN
        if (guesses < 6 && selectedWordArray.length === rightGuesses) {
          youWon();
        }
      }
    });
    /*
  IF the selected word does not contain the guess letter
  and guesses is lower than 6
  */
  } else if (selectedWordArray.includes(letterValue) === false && guesses < 6) {
    guesses++; // Increment wrong guesses
    hangmanImg.src = `images/h${guesses}.png`; // Update image

    console.log(`${guesses} wrong guesses`); // log wrong guess

    // Internal if to check if gameOver
    if (guesses === 6) {
      console.log('You lose');
      gameOver();
    }
  }
}

// (array of letters, letter)
function getLetterIndex(array, value) {
  letterIndex = []; // Empty the array

  for (let i = 0; i < array.length; i++) {
    /*
    If the position in the array has the same value as value
    Push that position to the array
    */
    if (array[i] === value) {
      letterIndex.push(i);
    }
  }
  return letterIndex;
}

// Print the word if you lost the game
function displayWord() {
  for (let i = 0; i < selectedWord.length; i++) {
    letterBoxEls.childNodes[i].firstChild.value = selectedWord[i];
  }
}
