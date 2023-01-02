import { getWordList } from "./wordList.js";

//ensures that the input boxes are cleared when the page is refreshed
window.onload = emptyAllBoxes();

//constants
const wordList = getWordList();
const numWords = wordList.length;
const greenBox = "seaGreen";
const yellowBox = "darkKhaki";
const redBox =  "indianRed";


let curWord = getRandomWord(wordList);
console.log(curWord);
let activeObj = document;
let gameGrid = document.getElementById("gameGrid");
let validLetters = "QWERTYUIOPASDFGHJKLZXCVBNM";
let inputBoxes = gameGrid.children;
let curRowStart = 0;
let curGuess = "";






activeObj.addEventListener('keypress', (e) => {
    let curInput = e.key.toUpperCase();
    
    if (curInput == "TAB"){
        return
    }
    if (curGuess.length >= 5 && curInput != "ENTER"){
        return
    }

    if (validLetters.includes(curInput) && curInput != ""){
        curGuess = curGuess + curInput;
        paintLettersToGrid(curRowStart);
    }

    if (curInput == "ENTER" ){
        //if enter hit with incomplete guess, do nothing
        if (curGuess.length < 5){
            return
        }
        else if (curGuess.length == 5){
            //incorrect guess
            if (curGuess != curWord){ 
                //paint the boxes green/red/yellow accordingly
                paintAllBoxesInRow(curRowStart);
                //shake the boxes sideways to indicate incorrect guess
                shakeAllElemsInRow(curRowStart,"X");
                //move to next row and reset curGuess
                curRowStart = curRowStart + 5;
                curGuess = "";

                //TODO: if this is the sixth incorrect guess, print failure message 
                if (curRowStart == 30){
                    setTimeout(() => {
                        window.alert("You didn't guess the word!");
                        resetGame();
                    }, 750);
                }
            }
            //correct guess
            else if (curGuess == curWord){
                //paint all boxes in the row green
                paintAllBoxesInRow(curRowStart);
                //shake all the boxes vertically
                shakeAllElemsInRow(curRowStart,"Y");

                //print victory message/menu
                setTimeout(() => {
                    window.alert("You correctly guessed the word!");
                    resetGame();
                }, 750);
            }
        }
    }
}  
);


activeObj.addEventListener('keyup', (e) => {
    let curInput = e.key.toUpperCase();
    
    if (curGuess.length < 0){
        return
    }

    if (curInput == "BACKSPACE" ){
        curGuess = curGuess.slice(0,-1);
        paintLettersToGrid(curRowStart);
    }
});


function paintLettersToGrid(startPos){
    for (let i=0; i < 5; i++){
        if (curGuess[i] == undefined){
            inputBoxes[startPos + i].value = "";
        } else {
        inputBoxes[startPos + i].value = curGuess[i];
        }
    }
};

function shakeAllElemsInRow(row, shakeAxis){
    for (let i=0; i < 5; i++){
        let curElem = inputBoxes[row + i]
        shakeElementViaCSS(curElem, shakeAxis);
    }
};

function getRandomWord(listOfWords){
    let randIndex = Math.floor(Math.random() * numWords)
    return wordList[randIndex];
};

function paintAllBoxesInRow(startRow){
    for (let i=0; i < 5; i++){
        let curBoxIndex = startRow+i;
        //the letter is not correct at all
        if (!curWord.includes(curGuess[i])){
            paintIndividualBox(curBoxIndex, redBox);
        //the letter is in the word but in the wrong place
        }else if (curGuess[i] === curWord[i]){
            paintIndividualBox(curBoxIndex, greenBox);
        //the letter is correctly placed
        }else if (curWord.includes(curGuess[i])){
            paintIndividualBox(curBoxIndex, yellowBox);
        }
    }
};

function paintIndividualBox(boxIndex, color){
    inputBoxes[boxIndex].style.backgroundColor = color;
    // inputBoxes[boxIndex].style.opacity = 1;
};

function shakeElementViaCSS(targetElem, shakeAxis){
    //adding the class names causes the element to shake
    targetElem.classList.add('animate__animated', 'animate__shake' + shakeAxis);

    //listening for the animation to finish and removing the class names
    targetElem.addEventListener('animationend', () => {
        targetElem.classList.remove('animate__animated', 'animate__shake' + shakeAxis);
      });
};


function resetGame(){
    emptyAllBoxes();
    curWord = getRandomWord(wordList);
    console.log(curWord);
    // activeObj = document;
    // gameGrid = document.getElementById("gameGrid");
    // validLetters = "QWERTYUIOPASDFGHJKLZXCVBNM";
    // inputBoxes = gameGrid.children;
    curRowStart = 0;
    curGuess = "";



}

function emptyAllBoxes(){    
    let testElems = Array.from(document.getElementsByClassName('row'));
    testElems = testElems.map( elem => {
        elem.value = ''
        elem.style.backgroundColor = "rgb(105, 105, 105)";
    })
}