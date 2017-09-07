const fs = require('fs');
const readline = require('readline');

const StopWordsFilePath = '../stop_words.txt';

let stopWordsText = fs.readFileSync(StopWordsFilePath, 'utf-8', 'r');

if(!stopWordsText) {
  console.log('Cant read stop_words file');
  return ;
}

let stopWords = stopWordsText.split(',');

if(!process.argv[2]){
  console.log('Please enter text file path');
  return;
}

const searchWordFilePath = process.argv[2];

const rl = readline.createInterface({
  input: fs.createReadStream(searchWordFilePath)
});

let wordFreqs = []

rl.on('line', (line) => {
  let startChar = 0;
  let i = 0;
  for(let c of line){
    if(!startChar) {
      if(c.match(/[a-zA-Z]/)){
        startChar = i
      }
      i++;
      continue;
    } 

    if(c.match(/[a-zA-Z]/)){
      i++;
      continue
    }

    word = line.slice(startChar, i).toLowerCase();
    
    if(stopWords.indexOf(word) > -1){
      i++;
      startChar = 0;
      continue;
    }

    let pair_index = 0;
    let found = false;

    for(let pair of wordFreqs) {
      if(word === pair[0]) {
        pair[i] += 1;
        found = true;
        break;
      }
      
      pair_index++;
    }
    
    if(!found) {
      wordFreqs.push([
        word, 1
      ]);

      i++;
      startChar = 0;
      continue;
    }

    i++;
  }
})
.on('close',()=>{
  wordFreqs.sort(function(a, b){
    return b[0].length - a[0].length;
  })
  
  wordFreqs.forEach((word)=> {
    console.log(word[0], ' - ', word[1]);
  })
})