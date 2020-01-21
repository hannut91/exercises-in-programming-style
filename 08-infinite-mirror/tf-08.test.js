const fs = require('fs');
const path = require('path');

const wordCount = (from, target) => {
  const stopWords = stopWordsFrom(from);
  const words = targetWords(target);
  const wordFreqs = count(words, stopWords);
  return sort(wordFreqs);
}

const targetWords = (filePath) =>
  fs.readFileSync(filePath, 'utf-8')
    .replace(/\W/g, ' ')
    .toLowerCase()
    .split(' ')
    .filter(isExist);

const stopWordsFrom = (filePath) =>
  fs.readFileSync(filePath, 'utf-8')
    .split(',')
    .map(toLowerCase);

const count = (words, stopWords, wordFreqs = {}) => {
  if (words.length === 0) {
    return wordFreqs;
  }

  const word = first(words);

  const newWordFreqs = stopWords.indexOf(word) < 0
    ? {
      ...wordFreqs,
      [word]: (wordFreqs[word] || 0) + 1
    }
    : { ...wordFreqs };

  return count(words.slice(1), stopWords, newWordFreqs);
}

const first = (arr) => arr[0];

const sort = (wordFreqs) => {
  let wordFreqsArr = [];
  for (let key in wordFreqs) {
    wordFreqsArr.push([
      key,
      wordFreqs[key]
    ])
  }

  wordFreqsArr.sort((a, b) => {
    if (a[1] === b[1]) {
      if (a[0] === b[0]) {
        return 0
      }

      return a[0] > b[0] ? 1 : -1
    }

    return a[1] < b[1] ? 1 : -1;
  });

  return wordFreqsArr;
}

const toLowerCase = (word) => word.toLowerCase();

const isExist = (str) => !!str;

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
