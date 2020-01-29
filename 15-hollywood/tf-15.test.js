const path = require('path');
const fs = require('fs');

const isNotEmpty = (data) => !!data;

class WordFrequencyFramework {
  constructor() {
    this.loadEventHandlers = [];
    this.doWorkEventHandlers = [];
    this.endEventHandlers = [];
  }

  registerForLoadEvent(handler) {
    this.loadEventHandlers.push(handler);
  }

  registerForDoworkEvent(handler) {
    this.doWorkEventHandlers.push(handler);
  }

  registerForEndEvent(handler) {
    this.endEventHandlers.push(handler);
  }

  run(from, target) {
    this.loadEventHandlers.forEach((it) => it());
    this.doWorkEventHandlers.forEach((it) => it());
    this.endEventHandlers.forEach((it) => it());
  }
}

class DataStorage {
  constructor(wfapp, stopWordFilter, filePath) {
    this.data = '';
    this.wordEventHandlers = [];
    this.stopWordFilter = stopWordFilter;
    this.filePath = filePath;
    wfapp.registerForLoadEvent(this.load.bind(this));
    wfapp.registerForDoworkEvent(this.productWords.bind(this));
  }

  load() {
    this.data = fs.readFileSync(this.filePath, 'utf-8')
      .replace(/\W/g, ' ')
      .toLowerCase();
  }

  productWords() {
    this.data.split(' ')
      .filter(isNotEmpty)
      .filter((it) => !this.stopWordFilter.isStopWord(it))
      .forEach((word) => {
        this.wordEventHandlers.forEach((it) => it(word))
      });
  }

  registerForWordEvent(handler) {
    this.wordEventHandlers.push(handler);
  }
}

class StopWordFilter {
  constructor(wfapp, filePath) {
    this.filePath = filePath;
    this.stopWords = [];
    wfapp.registerForLoadEvent(this.load.bind(this));
  }

  load() {
    this.stopWords = fs.readFileSync(this.filePath, 'utf-8')
      .toLowerCase()
      .split(',');
  }

  isStopWord(word) {
    return this.stopWords.indexOf(word) >= 0;
  }
}

class WordFrequencyCounter {
  constructor(wfapp, dataStorage) {
    this.wordFreqs = {};
    dataStorage.registerForWordEvent(this.incrementCount.bind(this))
  }

  incrementCount(word) {
    this.wordFreqs[word] = (this.wordFreqs[word] || 0) + 1;
  }

  printFreqs() {
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

const wordCount = (from, target) => {
  const wfapp = new WordFrequencyFramework();
  const stopWordFilter = new StopWordFilter(wfapp, from);
  const dataStorage = new DataStorage(wfapp, stopWordFilter, target);
  const wordFreqCounter = new WordFrequencyCounter(wfapp, dataStorage);
  wfapp.run();

  return wordFreqCounter.printFreqs();
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
