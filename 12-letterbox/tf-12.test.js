const path = require('path');
const fs = require('fs');

const isExist = (value) => !!value;

class DataStorageManager {
  constructor() {
    this.data = '';
  }

  dispatch([command, ...args]) {
    if (!command) {
      throw Error("Message not understood: ", command);
    }

    return this[command](...args);
  }

  init(filePath) {
    this.data = fs.readFileSync(filePath, 'utf-8')
      .replace(/\W/g, ' ')
      .toLowerCase();
  }

  words() {
    return this.data.split(' ')
      .filter(isExist);
  }
}

class StopWordManager {
  constructor() {
    this.stopWords = [];
  }

  dispatch([command, ...args]) {
    if (!command) {
      throw Error("Message not understood: ", command);
    }

    return this[command](...args);
  }
  init(filePath) {
    this.stopWords = fs.readFileSync(filePath, 'utf-8')
      .toLowerCase()
      .split(',');
  }

  isStopWord(word) {
    return this.stopWords.indexOf(word) >= 0;
  }
}

class WordFrequencyManager {
  constructor() {
    this.wordFreqs = {};
  }

  dispatch([command, ...args]) {
    if (!command) {
      throw Error("Message not understood: ", command);
    }

    return this[command](...args);
  }

  incrementCount(word) {
    this.wordFreqs[word] = (this.wordFreqs[word] || 0) + 1;
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

class WorldFrequencyController {
  dispatch([command, ...args]) {
    if (!command) {
      throw Error("Message not understood: ", command);
    }

    return this[command](...args);
  }

  init(from, target) {
    this.storageManager = new DataStorageManager(target);
    this.stopWordManager = new StopWordManager(from);
    this.wordFreqManager = new WordFrequencyManager();
    this.storageManager.dispatch(['init', target]);
    this.stopWordManager.dispatch(['init', from]);
  }

  run() {
    this.storageManager.dispatch(['words'])
      .filter(it => {
        return !this.stopWordManager.dispatch(['isStopWord', it])
      })
      .forEach(it => {
        this.wordFreqManager.dispatch(['incrementCount', it]);
      });

    return this.wordFreqManager.dispatch(['sorted']);
  }
}

const wordCount = (from, target) => {
  const wfController = new WorldFrequencyController();
  wfController.dispatch(['init', from, target]);
  return wfController.dispatch(['run']);
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
