const response = await fetch('/data/wordList.json');
const wordList = await response.json();


console.log(`the wordlist is ${wordList.length} words long, from ${wordList[0]} to ${wordList[wordList.length-1]}!`);


