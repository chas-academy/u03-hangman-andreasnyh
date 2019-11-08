// Globala variabler

//const wordList;      // Array: med spelets alla ord
let selectedWord; // Sträng: ett av orden valt av en slumpgenerator från arrayen ovan

let guesses = 0; // Number: håller antalet gissningar som gjorts
let hangmanImg; // Sträng: sökväg till bild som kommer visas (och ändras) fel svar. t.ex. `/images/h1.png`

let msgHolderEl; // DOM-nod: Ger meddelande när spelet är över
let startGameBtnEl = document.getElementById("startGameBtn"); // DOM-nod: knappen som du startar spelet med
let letterButtonEls = document.querySelectorAll("#letterButtons button"); // Array av DOM-noder: Knapparna för bokstäverna
let letterBoxEls = document.querySelector("#letterBoxes > ul"); // Array av DOM-noder: Rutorna där bokstäverna ska stå

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

// startGameBtnEl.onclick =
function startGame() {
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

  return selectedWord;
}

/*
Baserat på längden i `selectedWord` (loopa/iterera):
skapa ett nytt `<li>` element innehåller en `<input>`
Använd `.appendChild()` för att lägga till det skapade elementet inuti `letterBoxEls`
*/

function createLetterBoxes() {
  letterBoxEls.innerHTML = "";

  for (let i = 0; i < selectedWord.length - 1; i++) {
    // console.log(selectedWord[i]);
    let liEl = document.createElement("li");
    let liElInput = document.createElement("input");
    liElInput.setAttribute("type", "text");
    liElInput.setAttribute("value", selectedWord[i]);
    liElInput.setAttribute("placeholder", "__");
    liElInput.setAttribute("disabled", "");
    liEl.appendChild(liElInput); // make the input a child of the list-element
    letterBoxEls.appendChild(liEl); // make the list and input a child of letterbox
  }
}

// Listen to clicks on letters
letterButtonEls.forEach(letter => {
  letter.addEventListener("click", function() {
    // console.log(selectedWord.split(''));
    
    checkLetterValue2(letter.value);

  });
});

function checkLetterValue(letterValue) {
  // console.log(letterValue);
  
  switch (letterValue) {
    case 'A':
    case 'a':
          console.log(selectedWord);
      break;
  
    default:
      console.log("Ej godkänd bokstav");
      
      break;
  }
}

// callback
// 6.1 check letter value
/*
let callback = function (letter) {

  console.log(letter);
  debugger;
}
*/

function checkLetterValue2(letterValue) {

  selectedWordArray = selectedWord.split(''); // split word into array
  selectedWordArray.pop(); // remove last position, unwanted " "
  console.log(selectedWord);
  
  // selectedWordArray.forEach(letter => {

    if (selectedWordArray.includes(letterValue) && guesses < 6) {
      console.log(selectedWordArray.find(letterValue));
      
      
    } else if (!selectedWordArray.includes(letterValue) && guesses < 6){
      guesses++;
      console.log(guesses);
    } else {
      console.log("Game Över");
      
    }
    
  // });
};