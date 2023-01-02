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
startBox.focus();
// inputBoxes[inputIndex].focus();
let curGuess = "";
// let curGuessLen = curGuess.length;


activeObj.addEventListener('keypress', (e) => {
    activeObj = document.activeElement;
    let curInput = e.key.toUpperCase();
    
    // if the player hits Enter, validate if a full word has been typed, reject otherwise
    if (curInput == "ENTER"){
        //TODO: implement logic for rejecting Enter unless 5 letters have been entered
        // should give user a subtle nod that enter was rejected, maybe by wiggling input boxes for that row?
        return;
    }

    //if its a valid letter, increment index and add entered value to the curGuess, move to next box
    if (validLetters.includes(curInput) && curInput != ""){
        if (inputIndex <= 29){
            //&& ((inputIndex+1) % 5 != 0)
            //TODO: add an activeobject.value = "" to the backspace logic to correspond to this
            //TODO: this should fix the issue of backspacing one char to left when at 5-char wall
            inputIndex++;
        }
        curGuess = curGuess + curInput;
        console.log(curGuess);
        // console.log(curGuessLen);
        activeObj = inputBoxes[inputIndex];
        activeObj.focus();
    }  
});


activeObj.addEventListener('keyup', (e) => {
    activeObj = document.activeElement;
    let curInput = e.key.toUpperCase();

    //if the player has entered TAB, undo the default action of tabbing to next box
    if (curInput == "TAB"){
        activeObj = inputBoxes[inputIndex]
        activeObj.focus();
        shakeElementViaCSS(activeObj);
    }

    //if the player has entered an invalid char, clear the box without advancing to the next one
    //shake the element to give the user a visual cue that the input was not valid
    if (!validLetters.includes(curInput) && !validKeys.includes(curInput)){
        activeObj.value = "";
        activeObj = inputBoxes[inputIndex];
        activeObj.focus();
        shakeElementViaCSS(activeObj);
    }
});


activeObj.addEventListener('keydown', (e) => {
    activeObj = document.activeElement;
    let curInput = e.key.toUpperCase();

    //if the player has entered a backspace, diminish curGuess and move to previous input box
    if (curInput == "BACKSPACE"){
        if (inputIndex > 0){
            inputIndex--;
        };

        if (activeObj.value.length != 1){
            curGuess = curGuess.slice(0,-1);
            console.log(curGuess);
        }
        activeObj = inputBoxes[inputIndex];
        activeObj.focus();

    }
});



function shakeElementViaCSS(targetElem){
    //adding the class names causes the element to shake
    targetElem.classList.add('animate__animated', 'animate__shakeX');

    //listening for the animation to finish and removing the class names
    //this ensures the animation can happen again if triggered by user behavior
    targetElem.addEventListener('animationend', () => {
        targetElem.classList.remove('animate__animated', 'animate__shakeX');
      });
};