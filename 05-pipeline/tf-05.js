const fs = require('fs');

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function filterCharsAndNormalize(strData){
  return strData.replace(/\W/g, ' ').toLowerCase();
}

function scan(strData) {
  let words = strData.split(' ');
  words = words.filter((word)=>{
    return word;
  });
  return words;
}

function removeStopWords(words) {
  let stopWords = fs.readFileSync('../stop_words.txt', 'utf-8').split(',');
  stopWords = stopWords.map((stopWord)=>{
    return stopWord.toLowerCase();
  });
  return words.filter((word)=>{
    if(stopWords.indexOf(word) < 0){
      return true;
    }
  })
}

function frequencies(words) {
  let wordFreqs = {}
  words.forEach((word)=>{
    if(wordFreqs[word]){
      wordFreqs[word] += 1
    } else {
      wordFreqs[word] = 1;
    }
  })
  return wordFreqs;
}

function sort(wordFreqs) {
  let wordFreqsArr = [];
  for(let key in wordFreqs) {
    wordFreqsArr.push([
      key, 
      wordFreqs[key]
    ])
  }

  wordFreqsArr.sort(function(a, b) {
    return b[0].length - a[0].length;
  });

  return wordFreqsArr;
}

function printAll(wordFreqs) {
  wordFreqs.forEach((word)=> {
    console.log(word[0], ' - ', word[1]);
  })
}

let result = printAll(sort(frequencies(removeStopWords(scan(filterCharsAndNormalize(readFile(process.argv[2])))))));
