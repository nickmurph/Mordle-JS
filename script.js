import { getWordList } from "./wordList.js";

//ensures that the input boxes are cleared when the page is refreshed
window.onload = emptyAllBoxes();


//resize various elements of the UI to accomodate smaller mobile dimensions
resizeForMobile();

//constants
const wordList = getWordList();
const numWords = wordList.length;
const greenBox = "seaGreen";
const yellowBox = "darkKhaki";
const redBox =  "indianRed";
const gameGrid = document.getElementById("gameGrid");
const validLetters = "QWERTYUIOPASDFGHJKLZXCVBNM";



//variables
let inputBoxes = Array.from(document.getElementsByClassName('row'));
// inputBoxes = inputBoxes.filter(item => item.id != ""); //remove references to <br> elements(needed for iOS safari CSS grid issues)
let curWord = getRandomWord(wordList);
// console.log(curWord);
let activeObj = document;
let curRowStart = 0;
let curGuess = "";


let keyboardButtons = Array.from(document.getElementsByClassName('kbBTN'));
keyboardButtons.map(btn => {
    btn.addEventListener("click", function(){
        let curPress = btn.id;
   
        if (curPress == "BACKSPACE"){
            curGuess = curGuess.slice(0,-1);
            paintLettersToGrid(curRowStart);
        }else if (curPress == "ENTER") {
            handleEnterPressed();
        }else if (curGuess.length < 5){
        curGuess = curGuess + curPress;
        paintLettersToGrid(curRowStart);
        }
    })
});


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
        handleEnterPressed();
    }
}  
);

//backspace not handled well (at all?) by keypress, so using keyup
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


function handleEnterPressed(){
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

            //if this is the sixth incorrect guess, print failure message 
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

function emptyAllBoxes(){    
    let testElems = Array.from(document.getElementsByClassName('row'));
    testElems = testElems.map( elem => {
        elem.value = ''
        elem.style.backgroundColor = "rgb(105, 105, 105)";
    })
}

function resetGame(){
    emptyAllBoxes();
    curWord = getRandomWord(wordList);
    // console.log(curWord);
    curRowStart = 0;
    curGuess = "";
    resizeForMobile();
}

//mobile checking function, courtesy of https://stackoverflow.com/a/11381730
function checkMobile () {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };


function resizeForMobile () {
    let userWindowWidth = document.documentElement.clientWidth;
    if (checkMobile() || userWindowWidth < 700){
        let body = document.getElementById("mainBody");
        body.style.background = "rgb(20, 165, 213)";

        let boxes = Array.from(document.getElementsByClassName("row"));
        boxes.map(elem => {
            elem.style.width = "3.5rem";
            elem.style.height = "3.5rem";
        });

        let gridContainer = document.getElementById("gameGrid");
        gridContainer.style.columnGap = ".1rem";
        gridContainer.style.rowGap = ".1rem";

        let keys = Array.from(document.getElementsByClassName("kbBTN"));
        keys.map(elem => {
            elem.style.width = "2rem";
            elem.style.height = "2rem";
        });
        
        let mainLogo = document.getElementById("mainLogo");
        mainLogo.style.fontSize = "3rem";
        mainLogo.style.fontStyle = "italic";
    };
}