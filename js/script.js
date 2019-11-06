// Globala variabler

//const wordList;      // Array: med spelets alla ord
let selectedWord;    // Sträng: ett av orden valt av en slumpgenerator från arrayen ovan

let guesses = 0;     // Number: håller antalet gissningar som gjorts
let hangmanImg;      // Sträng: sökväg till bild som kommer visas (och ändras) fel svar. t.ex. `/images/h1.png`

let msgHolderEl;     // DOM-nod: Ger meddelande när spelet är över
let startGameBtnEl = document.getElementById('startGameBtn');  // DOM-nod: knappen som du startar spelet med
let letterButtonEls; // Array av DOM-noder: Knapparna för bokstäverna
let letterBoxEls;    // Array av DOM-noder: Rutorna där bokstäverna ska stå

// Funktion som startar spelet vid knapptryckning, och då tillkallas andra funktioner
// Funktion som slumpar fram ett ord
// Funktion som tar fram bokstävernas rutor, antal rutor beror på vilket ord slumpas fram
// Funktion som körs när du trycker på bokstäverna och gissar bokstav
// Funktion som ropas vid vinst eller förlust, gör olika saker beroende tillståndet
// Funktion som inaktiverar/aktiverar bokstavsknapparna beroende på vilken del av spelet du är på

 // Get array of words from file
let wordsFromTxt = null;

let xhr=new XMLHttpRequest();
xhr.open("GET","../assets/words.txt",false); // False turns off asynchronous behaviour
xhr.onload=function(){
    // wordsFromTxt = xhr.responseText;
    wordsFromTxt = xhr.responseText.toUpperCase();
    wordsFromTxt = wordsFromTxt.split('\n');
    // console.log(wordsFromTxt);
}
xhr.send();

const wordList = wordsFromTxt;

// console.log(wordList);

// startGameBtnEl.onclick = 
function click() {
    console.log("du klickade start!");
};

startGameBtnEl.addEventListener('click', startGame);