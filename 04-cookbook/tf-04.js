const fs = require('fs');

let data;
let words = []
let wordFreqs = []

function readFile(filePath) {
  data = fs.readFileSync(filePath, 'utf-8').split('');
}

function filterCharsAndNormalize() {
  
  data.forEach((word, index)=>{
    if(word.match(/[a-zA-Z]/)) {
      data[index] = data[index].toLowerCase();
    } else {
      data[index] = ' ';
    }
  })
}

function scan() {
  let dataStr = data.join('');
  words = dataStr.split(' ');
  words = words.filter((word)=>{
    return word;
  })
}

function removeStopWords() {
  let stopWords = fs.readFileSync('../stop_words.txt', 'utf-8').split(',').map((data)=> {
    return data.toLowerCase();
  });
  let indexes = [];
  for(let i = 0; i < words.length; i++) {
    if(stopWords.indexOf(words[i]) > -1){
      indexes.push(i);
    }
  }

  words = words.filter((data, index)=>{
    if(indexes.indexOf(index) < 0) return true;
  })
}

function frequencies() {
  words.forEach((word)=>{
    let foundedIndex = wordFreqs.findIndex((freq)=>{
      return freq[0] === word;
    })

    if(foundedIndex > -1) {
      wordFreqs[foundedIndex][1]++;
    } else {
      wordFreqs.push([word, 1]);
    }
  });
}

function sort() {
  wordFreqs.sort(function(a, b){
    return b[0].length - a[0].length;
  })
}

readFile(process.argv[2]);
filterCharsAndNormalize();
scan();
removeStopWords();
frequencies();
sort();
wordFreqs.forEach((word)=> {
  console.log(word[0], ' - ', word[1]);
})



