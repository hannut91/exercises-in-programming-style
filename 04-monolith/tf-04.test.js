const path = require('path');
const fs = require('fs');
const readline = require('readline');

const wordCount = async (from, target) => {
  const wordFreqs = [];
  const stopWords = fs.readFileSync(from, { encoding: 'utf-8' })
    .split(',')
    .map(i => i.toLocaleLowerCase());

  const fileStream = fs.createReadStream(target);
  const rl = readline.createInterface({ input: fileStream });
  for await (let line of rl) {
    line += '\n';
    let startCharIndex = undefined;
    let i = 0;

    for (const c of line) {
      if (startCharIndex === undefined) {
        if (c.match(/\w/)) {
          startCharIndex = i;
        }
      } else {
        if (!c.match(/\w/)) {
          let found = false;

          let word = line.slice(startCharIndex, i).toLowerCase();

          const r = stopWords.indexOf(word);
          if (r === -1) {
            for (const pair of wordFreqs) {
              if (word === pair[0]) {
                pair[1] += 1
                found = true
                break;
              }
            }

            if (!found) {
              wordFreqs.push([word, 1]);
            }
          }

          startCharIndex = undefined;
        }
      }

      i += 1;
    }
  }

  return [...wordFreqs]
    .sort((a, b) => {
      if (a[1] === b[1]) {
        if (a[0] === b[0]) {
          return 0
        }

        return a[0] > b[0] ? 1 : -1
      }

      return a[1] < b[1] ? 1 : -1;
    });
}

test('wordCount', async () => {
  const target = path.join(__dirname, '../input.txt');
  const from = path.join(__dirname, '../stop_words.txt');

  expect(await wordCount(from, target)).toEqual([
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
