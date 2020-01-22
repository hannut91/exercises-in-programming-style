const path = require('path');
const fs = require('fs');

const isExist = (value) => !!value;

const toLowerCase = (str) => str.toLowerCase();

class DataStorageManager {
  constructor(filePath) {
    this.data = fs.readFileSync(filePath, 'utf-8')
      .replace(/\W/g, ' ')
      .toLowerCase();

  }

  words() {
    return this.data.split(' ')
      .filter(isExist)
      .map(toLowerCase);
  }
}

class StopWordManager {
  constructor(filePath) {
    this.stopWords = fs.readFileSync(filePath, 'utf-8')
      .split(',')
      .map(toLowerCase);
  }

  isStopWord(word) {
    return this.stopWords.indexOf(word) >= 0
  }
}

class WordFrequencyManager {
  constructor() {
    this.wordFreqs = {};
  }

  incrementCount(word) {
    this.wordFreqs[word] = (this.wordFreqs[word] || 0) + 1
  }

  sorted() {
    let wordFreqsArr = [];
    for (let key in this.wordFreqs) {
      wordFreqsArr.push([
        key,
        this.wordFreqs[key]
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
}

class WordFrequencyController {
  constructor(from, target) {
    this.storageManager = new DataStorageManager(target);
    this.stopWordManager = new StopWordManager(from);
    this.wordFreqManager = new WordFrequencyManager();
  }

  run() {
    this.storageManager.words()
      .filter(it => !this.stopWordManager.isStopWord(it))
      .forEach(it => {
        this.wordFreqManager.incrementCount(it);
      });

    return this.wordFreqManager.sorted();
  }
}

test('wordCount', async () => {
  const target = path.join(__dirname, '../input.txt');
  const from = path.join(__dirname, '../stop_words.txt');

  expect(new WordFrequencyController(from, target).run()).toEqual([
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
