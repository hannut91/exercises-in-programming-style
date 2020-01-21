const path = require('path');
const fs = require('fs');

const readFile = (filePath, func) => {
  const data = fs.readFileSync(filePath, 'utf-8');
  func(data, normalize)
}

const filterChars = (strData, func) => {
  func(strData.replace(/\W/g, ' '), scan)
}

const normalize = (strData, func) => {
  func(
    strData
      .split(' ')
      .map(toLowerCase)
      .filter(isExist)
      .join(' '),
    removeStopWords
  )
}

const scan = (strData, func) => {
  func(strData.split(' '), frequencies)
}

const removeStopWords = (words, func) => {
  const stopWords = fs.readFileSync(
    path.join(__dirname, '../stop_words.txt'),
    'utf-8'
  ).split(',')
    .map(toLowerCase);

  func(
    words.filter((word) => stopWords.indexOf(word) < 0),
    sort
  )
}

const frequencies = (words, func) => {
  const wf = words.reduce((acc, cur) => ({
    ...acc,
    [cur]: (acc[cur] || 0) + 1,
  }), {});

  func(wf, printText)
}

const sort = (wf, func) => {
  let wordFreqsArr = [];
  for (let key in wf) {
    wordFreqsArr.push([
      key,
      wf[key]
    ])
  }

  const wordFreqs = wordFreqsArr.sort((a, b) => {
    if (a[1] === b[1]) {
      if (a[0] === b[0]) {
        return 0
      }

      return a[0] > b[0] ? 1 : -1
    }

    return a[1] < b[1] ? 1 : -1;
  });

  func(wordFreqs, noOp)
}

const printText = (wordFreqs) => {
  wordFreqs.forEach((it) => console.log(`${it[0]} - ${it[1]}`));
}

const noOp = (func) => {
  return
}

const wordCount = (target) => {
  readFile(target, filterChars);
}

const toLowerCase = (word) => word.toLowerCase();

const isExist = (str) => !!str;

test('wordCount', async () => {
  const target = path.join(__dirname, '../input.txt');

  wordCount(target)
});
