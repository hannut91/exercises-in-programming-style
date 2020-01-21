const path = require('path');
const fs = require('fs');

class TheOne {
  constructor(value) {
    this.value = value;
  }

  bind(func) {
    this.value = func(this.value);
    return this;
  }
}

const wordCount = (from, target) =>
  new TheOne(target)
    .bind(readFile)
    .bind(filterChars)
    .bind(normalize)
    .bind(scan)
    .bind(removeStopWords(from))
    .bind(frequencies)
    .bind(sort)
    .value;

const readFile = (filePath) => fs.readFileSync(filePath, 'utf-8');

const filterChars = (strData) => strData.replace(/\W/g, ' ');

const normalize = (strData) => strData.toLowerCase();

const scan = (strData) => strData.split(' ').filter(isExist);

const removeStopWords = (filePath) => (words) => {
  const stopWords = fs
    .readFileSync(filePath, 'utf-8')
    .split(',')
    .map(toLowerCase);

  return words.filter((word) => stopWords.indexOf(word) < 0);
}

const frequencies = (words) =>
  words.reduce((acc, cur) => ({
    ...acc,
    [cur]: (acc[cur] || 0) + 1,
  }), {});

const sort = (wordFreqs) => {
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

const isExist = (str) => !!str;

const toLowerCase = (word) => word.toLowerCase();

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
