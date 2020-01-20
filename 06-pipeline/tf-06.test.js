const fs = require('fs');
const path = require('path');

const readFile = (filePath) => fs.readFileSync(filePath, 'utf-8');

const filterCharsAndNormalize = (str) =>
  str.replace(/\W/g, ' ').toLowerCase()

const scan = (strData) => strData.split(' ').filter((word) => word);

const removeStopWords = (target) => (words) => {
  let stopWords = readFile(target)
    .split(',')
    .map((stopWord) => stopWord.toLowerCase());

  return words.filter((word) => stopWords.indexOf(word) < 0);
}

const frequencies = (words) =>
  words.reduce((acc, cur) => ({
    ...acc,
    [cur]: acc[cur] ? acc[cur] + 1 : 1
  }), {});

function sort(wordFreqs) {
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

const wordCount = (from, target) => {
  return sort(
    frequencies(
      removeStopWords(from)(
        scan(
          filterCharsAndNormalize(
            readFile(target))))));
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
