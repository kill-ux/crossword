const canPlace = (tab, screen, word, p1, p2, direction) => {
  if (direction === "row") {
    if (p2 + word.length > tab[0].length) return false;
    for (let i = 0; i < word.length; i++) {
      if (screen[p1][p2 + i] == ".") return false;
      if (tab[p1][p2 + i] != "." && tab[p1][p2 + i] != word[i]) return false;

    }
  } else {
    if (p1 + word.length > tab.length) return false; 
    for (let i = 0; i < word.length; i++) {
      if (screen[p1 + i][p2] == "." ) return false;
      if (tab[p1 + i][p2] != "." && tab[p1 + i][p2] != word[i]) return false;
    }
  }
  return true;
};

const placeWord = (tab, word, p1, p2, direction) => {
  const backup = [];
  if (direction == "row") {
    for (let i = 0; i < word.length; i++) {
      backup.push(tab[p1][p2 + i]);
      tab[p1][p2 + i] = word[i];
    }
  } else {
    for (let i = 0; i < word.length; i++) {
      backup.push(tab[p1 + i][p2]);
      tab[p1 + i][p2] = word[i];
    }
  }
  return backup;
};

const placeWordBack = (tab, word, p1, p2, direction) => {
  if (direction == "row") {
    for (let i = 0; i < word.length; i++) {
      tab[p1][p2 + i] = word[i];
    }
  } else {
    for (let i = 0; i < word.length; i++) {
      tab[p1 + i][p2] = word[i];
    }
  }
};

const append = (array, ...obj) => {
  return [...array, ...obj];
};

//////////////
const groupWord = (screen, list, p1, p2) => {
  let screeList = [...list];
  let res = [];
  let num = 1 * screen[p1][p2];
  for (const w1 of screeList) {
    let temp = [];
    let index = 0;
    for (let i = 0; i < screeList.length; i++) {
      if (w1[0] == screeList[i][0]) {
        temp = append(temp, screeList[i]);
        screeList = append(screeList.slice(0, i), ...screeList.slice(i + 1));
        i--;
      }
      index++;
    }
    if (temp.length >= num) {
      res = append(res, temp);
    }
  }
  //
  return res;
};
//////////////

const solvePuzzle = (tab, words, screen, p1, p2) => {
  // if (p1 == 0 && p2 == 4) {
  //   return true;
  // }


  if (p1 == tab.length - 1 && p2 == tab[tab.length - 1].length - 1) {
    // console.log("finish");
    // console.log(tab);
    let solution = tab.map(arr => arr.join('')).join('\n')
    console.log(solution);
    return true;
  }

  //
  let skip = false;
  if (screen[p1][p2] != "0" && screen[p1][p2] != "." && tab[p1][p2] != ".") {
    for (const element of words) {
      if (element[0] == tab[p1][p2]) {
        skip = true;
      }
    }
    if (!skip) {
      return false;
    }
  }
  //

  const nextP1 = p2 + 1 == tab[0].length ? p1 + 1 : p1;
  const nextP2 = p2 + 1 == tab[0].length ? 0 : p2 + 1;
  if (screen[p1][p2] == "0" || screen[p1][p2] == ".") {
    return solvePuzzle(tab, words, screen, nextP1, nextP2); // Skip non-fillable spots
  }
  let index = 0;
  for (const word of words) {
    //tab, screen, word, p1, p2, direction
    if (canPlace(tab, screen, word, p1, p2, "row")) {
      let backup = [];
      let backup1 = [];
      let backup2 = [];
      let res = groupWord(screen, words, p1, p2); // [[casa,ciao][]]
      if (screen[p1][p2] == "2") {
        backup1 = placeWord(tab, res[index][0], p1, p2, "row");
        backup2 = placeWord(tab, res[index][1], p1, p2, "col");
      } else {
        backup = placeWord(tab, word, p1, p2, "row");
      }
      if (
        solvePuzzle(
          tab,
          words.filter((w) => {
            if (screen[p1][p2] == "2") {
              return w != res[index][0] && w != res[index][1];
            }
            return w != word;
          }),
          screen,
          nextP1,
          nextP2
        )
      ) {
        return true;
      }
      if (screen[p1][p2] == "2") {
        placeWordBack(tab, backup1, p1, p2, "row");
        placeWordBack(tab, backup2, p1, p2, "col");
      } else {
        placeWordBack(tab, backup, p1, p2, "row");
      }
      backup = [];
      backup1 = [];
      backup2 = [];
    }

    if (canPlace(tab, screen, word, p1, p2, "col")) {
      let backup = [];
      let backup1 = [];
      let backup2 = [];
      let res = groupWord(screen, words, p1, p2);
      if (screen[p1][p2] == "2") {
        //

        //
        backup1 = placeWord(tab, res[index][1], p1, p2, "row");
        backup2 = placeWord(tab, res[index][0], p1, p2, "col");
      } else {
        backup = placeWord(tab, word, p1, p2, "col");
      }
      if (
        solvePuzzle(
          tab,
          words.filter((w) => {
            if (screen[p1][p2] == "2") {
              return w != res[index][0] && w != res[index][1];
            }
            return w != word;
          }),
          screen,
          nextP1,
          nextP2
        )
      )
        return true;
      if (screen[p1][p2] == "2") {
        placeWordBack(tab, backup1, p1, p2, "row");
        placeWordBack(tab, backup2, p1, p2, "col");
      } else {
        placeWordBack(tab, backup, p1, p2, "col");
      }
      backup = [];
      backup1 = [];
      backup2 = [];
    }
    index++;
  }

  return false; // No solution found
};

const crosswordSolver = (epuzzle, list) => {
  let tab = epuzzle.split("\n").map((row) => row.split("")); // 2D array
  let screen = [];
  for (let i = 0; i < tab.length; i++) {
    let newTab = [];
    for (let j = 0; j < tab[i].length; j++) {
      newTab[j] = ".";
    }
    screen[i] = newTab;
  }
  let len = tab[0].length;

  for (const row of tab) {
    if (row.length != len) {
      console.log("Error: Rows must be of equal length.");
      return false;
    }
  }
  if (solvePuzzle(screen, list, tab, 0, 0)) {
    return true;
  }

  return false;
};

const puzzle = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`
const words = [
  'sunglasses',
  'sun',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
]

crosswordSolver(puzzle, words)
