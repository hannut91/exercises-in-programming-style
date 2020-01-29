const path = require('path');
const fs = require('fs');

const isNotEmpty = (data) => !!data;

const extractWords = (obj, filePath) => {
  obj['data'] = fs.readFileSync(filePath, 'utf-8')
  .replace(/\W/g, ' ')
  .toLowerCase()
  .split(' ')
  .filter(isNotEmpty);
};

const loadStopWords = (obj, filePath) => {
  obj['stopWords'] = fs.readFileSync(filePath, 'utf-8')
    .toLowerCase()
    .split(',');
}

const incrementCount = (obj, w) => {
  obj['freqs'][w] = (obj['freqs'][w] || 0) + 1;
}

const sorted = (wordFreqs) => {
  let wordFreqsArr = [];
  for (let key in wordFreqs) {
    wordFreqsArr.push([
      key,
      wordFreqs[key]
    ])
  }

  return wordFreqsArr.sort((a, b) => {
    if (a[1] === b[1]) {
      if (a[0] === b[0]) {
        return 0
      }

      return a[0] > b[0] ? 1 : -1
    }

    return a[1] < b[1] ? 1 : -1;
  });
}

const dataStorage = {
  data: [],
  init: (filePath) => extractWords(dataStorage, filePath),
  words: () => dataStorage['data'],
};

const stopWords = {
  stopWords: [],
  init: (filePath) => loadStopWords(stopWords, filePath),
  isStopWord: (word) => stopWords['stopWords'].indexOf(word) >= 0,
};

const wordFreqs = {
  freqs: {},
  incrementCount: (w) => incrementCount(wordFreqs, w),
  sorted: () => sorted(wordFreqs['freqs']),
}

const wordCount = (from, target) => {
  dataStorage['init'](target);
  stopWords['init'](from);
  
  dataStorage['words']().filter((word) => !stopWords['isStopWord'](word))
    .forEach(wordFreqs['incrementCount'])

  return wordFreqs['sorted']();
}

test('wordCount', async () => {
  const target = path.join(__dirname, '../input.txt');
  const from = path.join(__dirname, '../stop_words.txt');

  expect(wordCount(from, target)).toEqual([
    ['live', 2],
    ['mostly', 2],
    ['africa', 1],
    ['india', 1],
    ['lions', 1],
    ['tigers', 1],
    ['white', 1],
    ['wild', 1]
  ]);
});
