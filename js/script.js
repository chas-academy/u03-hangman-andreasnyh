// Globala variabler

//const wordList;      // Array: med spelets alla ord
let selectedWord; // Sträng: ett av orden valt av en slumpgenerator från arrayen ovan
let letterIndex = [];

let rightGuesses = 0;
let guesses = 0; // Number: håller antalet gissningar som gjorts
let hangmanImg = document.getElementById("hangman"); // Sträng: sökväg till bild som kommer visas (och ändras) fel svar. t.ex. `/images/h1.png`

let msgHolderEl = document.getElementById("message"); // DOM-nod: Ger meddelande när spelet är över
let startGameBtnEl = document.getElementById("startGameBtn"); // DOM-nod: knappen som du startar spelet med
let letterButtonEls = document.querySelectorAll("#letterButtons button"); // Array av DOM-noder: Knapparna för bokstäverna
let letterBoxEls = document.querySelector("#letterBoxes > ul"); // Array av DOM-noder: Rutorna där bokstäverna ska stå

let buttonDisabled = false;
// Funktion som startar spelet vid knapptryckning, och då tillkallas andra funktioner
// Funktion som slumpar fram ett ord
// Funktion som tar fram bokstävernas rutor, antal rutor beror på vilket ord slumpas fram
// Funktion som körs när du trycker på bokstäverna och gissar bokstav
// Funktion som ropas vid vinst eller förlust, gör olika saker beroende tillståndet
// Funktion som inaktiverar/aktiverar bokstavsknapparna beroende på vilken del av spelet du är på

// Get array of words from file
let wordsFromTxt = null;
const urlEng = "../assets/words.txt";
const urlSwe = "../assets/wordsSWE.txt";

let xhr = new XMLHttpRequest();
xhr.open("GET", urlSwe, false); // False turns off asynchronous behaviour
xhr.onload = function() {
  // wordsFromTxt = xhr.responseText;
  wordsFromTxt = xhr.responseText.toUpperCase();
  wordsFromTxt = wordsFromTxt.split("\n");
  // console.log(wordsFromTxt);
};
xhr.send();

disableLetters(); // Disable letters on load

/*
function removeWordsContainingDash(item) {
  if (item.includes("-")) {
    splice(item, 1);
  }
  return;
}
*/
// const wordList = wordsFromTxt.filter(removeWordsContainingDash);

// Save wordsFromText items, that does not include a '-' in wordList
wordsFromTxt = wordsFromTxt.filter(item => !item.includes("á"));
wordsFromTxt = wordsFromTxt.filter(item => !item.includes("é"));
wordsFromTxt = wordsFromTxt.filter(item => !item.includes("ó"));
wordsFromTxt = wordsFromTxt.filter(item => !item.includes("'"));
wordsFromTxt = wordsFromTxt.filter(item => !item.includes("ü"));
const wordList = wordsFromTxt.filter(item => !item.includes("-"));

// Log wordList array
// console.log(wordList);

// Listen for clicks on startbutton
startGameBtnEl.addEventListener("click", startGame);

function startGame() {
  startGameBtnEl.innerHTML = "Slumpa nytt ord";
  enableLetters();
  generateRandomWord();
  createLetterBoxes();
}

/*
Skapa en funktion, kalla den för generateRandomWord().
Inuti denna funktion returnera ett slumpat ord ur arrayen av ord (wordList):
`wordList[Math.floor(Math.random()*wordList.length)];`
*/
function generateRandomWord() {
  selectedWord = wordList[Math.floor(Math.random() * wordList.length)];

  // Disable the start button after click
  // startGameBtnEl.disabled = true;
  console.log(selectedWord);
  return selectedWord;
}

/*
Baserat på längden i `selectedWord` (loopa/iterera):
skapa ett nytt `<li>` element innehåller en `<input>`
Använd `.appendChild()` för att lägga till det skapade elementet inuti `letterBoxEls`
*/

function createLetterBoxes() {
  letterBoxEls.innerHTML = "";

  // for (let i = 0; i < selectedWord.length - 1; i++) { // For live server
  for (let i = 0; i < selectedWord.length; i++) {
    // For publication
    // console.log(selectedWord[i]);
    let liEl = document.createElement("li");
    let liElInput = document.createElement("input");
    liElInput.setAttribute("type", "text");
    // liElInput.setAttribute("value", selectedWord[i]);
    liElInput.setAttribute("placeholder", "__");
    liElInput.setAttribute("disabled", "");
    liEl.appendChild(liElInput); // make the input a child of the list-element
    letterBoxEls.appendChild(liEl); // make the list and input a child of letterbox
  }
}

function createMessage(message) {
  let msgArticle = document.createElement("article");
  let msgHeading = document.createElement("h2");
  let msgParagraph = document.createElement("p");

  let msgBtnDiv = document.createElement("div");
  let msgBtnYes = document.createElement("input");
  let msgBtnNo = document.createElement("input");

  msgArticle.setAttribute("id", "messageArticle");

  msgHeading.innerText = message; // win or loose message
  msgParagraph.innerText = "Vill du spela igen?";
  msgArticle.appendChild(msgHeading); // make the input a child of the list-element
  msgArticle.appendChild(msgParagraph); // make the input a child of the list-element
  msgHolderEl.appendChild(msgArticle); // make the list and input a child of letterbox

  msgBtnDiv.setAttribute("class", "messageBtnDiv");

  msgBtnYes.setAttribute("type", "button");
  msgBtnYes.setAttribute("class", "restartBtn btn btn--stripe");
  msgBtnYes.setAttribute("value", "JA");

  msgBtnNo.setAttribute("type", "button");
  msgBtnNo.setAttribute("class", "restartBtn btn btn--stripe");
  msgBtnNo.setAttribute("value", "NEJ");

  msgBtnDiv.appendChild(msgBtnYes);
  msgBtnDiv.appendChild(msgBtnNo);
  msgArticle.appendChild(msgBtnDiv);

  msgHolderEl.style.visibility = "visible";

  // Listen to yes or no to restart the game
  // let restartBtn = document.querySelectorAll("restartBtn");
  msgBtnYes.addEventListener("click", function() {
    reset();
  });

  msgBtnNo.addEventListener("click", function() {
    window.location = "https://chasacademy.se/";
  });
}

function youWon() {
  document.removeEventListener("keydown", keyListener);
  disableLetters();
  createMessage("Du vann!");
  // console.log(selectedWord[i]);
}

function gameOver() {
  document.removeEventListener("keydown", keyListener);
  disableLetters();
  displayWord();
  createMessage("Bättre lycka nästa gång");
}

function enableLetters() {
  letterButtonEls.forEach(letter => {
    letter.disabled = false;
  });
}

function disableLetters() {
  letterButtonEls.forEach(letter => {
    letter.disabled = true;
  });
}

function reset() {
  msgHolderEl.style.visibility = "hidden";
  msgHolderEl.innerHTML = "";
  startGameBtnEl.disabled = false;
  startGameBtnEl.innerHTML = "Starta spelet";
  rightGuesses = 0;
  guesses = 0;
  hangmanImg.src = `images/h${guesses}.png`;
  buttonDisabled = false;
  enableLetters();
  startGame();
  document.addEventListener("keydown", keyListener);
}

// Listen to clicks on letters
letterButtonEls.forEach(letter => {
  letter.addEventListener("click", function() {
    // console.log(selectedWord.split(''));
    
    checkLetterValue2(selectedWord, letter, letter.value);
    // letter.disabled = true;
  });
});


function checkLetterValue2(word, letter, letterValue) {
  let selectedWordArray = word.split(""); // split word into array
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
    letterButtonEls.forEach(letterButton => {
      if (letterButton.value === letterValue && letterButton.disabled === false) {
        letterButton.disabled = true;
        buttonDisabled = true;

            
        // Returns an array of positions in selectedWordArray where letterValue is present
        getLetterIndex(selectedWordArray, letterValue);

        // Loop to display correctly guessed letters
        for (let i = 0; i < letterIndex.length; i++) {
          let pos = letterIndex[i];
          letterBoxEls.childNodes[pos].firstChild.value = letterValue;
        }

        rightGuesses = rightGuesses + letterIndex.length;

        console.log(
          `You guessed: ${letterValue} for a total of ${rightGuesses} correct guesses`
          );



        // Internal if to check if WIN
        if (guesses < 6 && selectedWordArray.length === rightGuesses) {
          youWon();
        }

      }
    });

    // letter.disabled = true;
  }
  else if (selectedWordArray.includes(letterValue) === false && guesses < 6) {
    guesses++;
    hangmanImg.src = `images/h${guesses}.png`;
    console.log(`${guesses} wrong guesses`);

    if (guesses === 6) {
      console.log("You lose");
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
/*
      let letterPos = selectedWordArray.reduce(function (accumulator, letterValue, position) {
        if (letterValue) {
          let accumulator = accumulator.push(position);
          return accumulator;
        }
      });
      */

// å = 221
// ä = 222
// ö = 192

const keyListener = function() {
  if (
    (event.keyCode >= 65 && event.keyCode <= 90) || //a - z
    event.keyCode === 192 || // ö
    event.keyCode === 221 || //å
    event.keyCode === 222 // ä
  ) {
    // console.log(event);
    // console.log(KeyboardEvent.key);

    // let eventKey = event.key;
    // eventKey = eventKey.toUpperCase();
    // console.log(`${eventKey}: ${event.keyCode}`);

    checkLetterValue2(selectedWord, event, event.key);
  }
};
document.addEventListener("keydown", keyListener);
