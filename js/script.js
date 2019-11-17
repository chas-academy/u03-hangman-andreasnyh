/* eslint-disable require-jsdoc */
// ###################### Global variables ######################### //

let selectedWord; // String: The chosen randomized word
let letterIndex = []; // Array: Positions of correctly guessed letters

let rightGuesses = 0; // Number: Correct guesses
let guesses = 0; // Number: Wrong guesses

// Check if button has been disabled (keyboard support)
let buttonDisabled = false;

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

disableLetters(); // Disable letterbuttons on load

// #################### Get words from file #################### //

// Get array of words from file
let wordsFromTxt = null;
// const urlEng = '../assets/words.txt'; // English wordlist to be implemented
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

// Listen for clicks on startbutton
startGameBtnEl.addEventListener('click', startGame);

function startGame() {
  startGameBtnEl.innerHTML = 'Slumpa nytt ord';
  enableLetters();
  generateRandomWord();
  createLetterBoxes();
}

/*
Get a random word from wordList
*/
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
    letterBoxEls.appendChild(liEl); // make the list and input a child of letterbox
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
  document.removeEventListener('keydown', keyListener);
  disableLetters();
  createMessage('Du vann!');
  // console.log(selectedWord[i]);
}

function gameOver() {
  document.removeEventListener('keydown', keyListener);
  disableLetters();
  displayWord();
  createMessage('Bättre lycka nästa gång');
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

function reset() {
  msgHolderEl.style.visibility = 'hidden';
  msgHolderEl.innerHTML = '';
  startGameBtnEl.disabled = false;
  startGameBtnEl.innerHTML = 'Starta spelet';
  rightGuesses = 0;
  guesses = 0;
  hangmanImg.src = `images/h${guesses}.png`;
  buttonDisabled = false;
  enableLetters();
  startGame();
  document.addEventListener('keydown', keyListener);
}

// Listen to clicks on letters
letterButtonEls.forEach((letter) => {
  letter.addEventListener('click', function() {
    // console.log(selectedWord.split(''));

    checkLetterValue2(selectedWord, letter, letter.value);
    // letter.disabled = true;
  });
});

function checkLetterValue2(word, letter, letterValue) {
  const selectedWordArray = word.split(''); // split word into array
  // selectedWordArray.pop(); // remove last position, unwanted " "
  // console.log(selectedWordArray); // log array of individual letters
  startGameBtnEl.disabled = true;
  letterValue = letterValue.toUpperCase();

  if (
    // Letter exists guesses lower than five and right guesses not equal to length of word
    selectedWordArray.includes(letterValue) === true &&
    guesses < 6 &&
    selectedWordArray.length !== rightGuesses
  ) {
    // console.log(selectedWordArray.find(letterValue));
    // debugger;

    // disable button of pressed letter && letterButton.disabled === false
    letterButtonEls.forEach((letterButton) => {
      // Check if the button has been disabled to stop being able to press the same correct key multiple times on the keyboard
      if (
        letterButton.value === letterValue &&
        letterButton.disabled === false
      ) {
        letterButton.disabled = true;
        buttonDisabled = true;

        // Returns an array of positions in selectedWordArray where letterValue is present
        getLetterIndex(selectedWordArray, letterValue);

        // Loop to display correctly guessed letters
        for (let i = 0; i < letterIndex.length; i++) {
          const pos = letterIndex[i];
          letterBoxEls.childNodes[pos].firstChild.value = letterValue;
        }

        rightGuesses = rightGuesses + letterIndex.length;

        console.log(
            `You guessed: ${letterValue} for a total of ${rightGuesses} correct guesses`,
        );

        // Internal if to check if WIN
        if (guesses < 6 && selectedWordArray.length === rightGuesses) {
          youWon();
        }
      }
    });

    // letter.disabled = true;
  } else if (selectedWordArray.includes(letterValue) === false && guesses < 6) {
    guesses++;
    hangmanImg.src = `images/h${guesses}.png`;
    console.log(`${guesses} wrong guesses`);

    if (guesses === 6) {
      console.log('You lose');
      gameOver();
    }
  }

  // });
}

function getLetterIndex(array, value) {
  letterIndex = [];

  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      letterIndex.push(i);
    }
  }
  return letterIndex;
}

function displayWord() {
  for (let i = 0; i < selectedWord.length; i++) {
    letterBoxEls.childNodes[i].firstChild.value = selectedWord[i];
  }
}

// å = 221
// ä = 222
// ö = 192

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
document.addEventListener('keydown', keyListener);
