import { getWordList } from "./wordList.js";


const wordList = getWordList();
console.log(`the wordlist is ${wordList.length} words long, from ${wordList[0]} to ${wordList[wordList.length-1]}!`);


//ensures that the input boxes are cleared when the page is refreshed
window.onload = function() {
    let testElems = Array.from(document.getElementsByClassName('row'));
    testElems = testElems.map( elem => {
        elem.value = ''
    })
};

let activeObj = document;
let inputGrid = document.getElementById("inputGrid");
let validLetters = "QWERTYUIOPASDFGHJKLZXCVBNM";
let validKeys = ["BACKSPACE","ENTER","TAB"];
let inputBoxes = inputGrid.children;
//indexes of 0-29 represent the input boxes
//leading zeros in first two rows merely for visual alignment
// 00 01 02 03 04
// 05 06 07 08 09
// 10 11 12 13 14
// 15 16 17 18 19
// 20 21 22 23 24
// 26 26 27 28 29

let inputIndex = 0;
let startBox = inputBoxes[0];
let curRowStart = 0;
// startBox.focus();
// inputBoxes[inputIndex].focus();
let curGuess = "";



activeObj.addEventListener('keypress', (e) => {
    activeObj = document.getElementById("testInput");
    let curInput = e.key.toUpperCase();
    
    if (curInput == "TAB"){
        return
    }
    if (curGuess.length >= 5 && curInput != "ENTER"){
        return
    }

    if (validLetters.includes(curInput) && curInput != ""){
       curGuess = curGuess + curInput;
        console.log(curGuess);
        activeObj.textContent = curGuess;
        paintLettersToGrid(curRowStart);
    }

    if (curInput == "ENTER" ){
        //TODO: if enter hit with incomplete guess, do nothing. ELSE, do other checks
        if (curGuess.length < 5){
            console.log("enter pressed prematurely");
        }
        //TODO: if enter hit with 5 letters in guess, validate the guess
        else if (curGuess.length == 5){
            console.log("validate guess here");
            //TODO: paint the boxes green/red/yellow accordingly 
            //shake the boxes sideways to indicate incorrect guess
            for (let i=0; i < 5; i++){
                let curElem = inputBoxes[curRowStart + i]
                shakeElementViaCSS(curElem);
            }

            //move to next row and reset curGuess
            curRowStart = curRowStart + 5;
            curGuess = "";

        //TODO: if guess is correct, shake the boxes vertically, paint all green, print victory message
        }

 
    }
}  
);


activeObj.addEventListener('keyup', (e) => {
    if (curGuess.length < 0){
        return
    }

    activeObj = document.getElementById("testInput");
    let curInput = e.key.toUpperCase();

    if (curInput == "BACKSPACE" ){
        curGuess = curGuess.slice(0,-1);
        console.log(curGuess);
        activeObj.textContent = curGuess;
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
}



function shakeElementViaCSS(targetElem){
    //adding the class names causes the element to shake
    targetElem.classList.add('animate__animated', 'animate__shakeX');

    //listening for the animation to finish and removing the class names
    //this ensures the animation can happen again if triggered by user behavior
    targetElem.addEventListener('animationend', () => {
        targetElem.classList.remove('animate__animated', 'animate__shakeX');
      });
};