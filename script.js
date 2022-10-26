// import wordList from '/data/wordList.json' assert {type: 'json'};
//import assertions not supported in firefox but this works in other browsers
//throws MIME error without the assertion

//works in all browsers tested
const response = await fetch('/data/wordList.json');
const wordList = await response.json();


console.log(wordList[0]);

//alternate method written when encountering issues above
//pasted the entire json object into a js file as an array
//wrote a getter function and imported it here
// import {getWordList} from './wordList.js';
// let wordList = getWordList();

// console.log(wordList[0]);
