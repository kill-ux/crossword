let results = [];

const validList = (list) => {
  const unique = new Set(list)
  return [...unique].length === list.length
}

const validParams = (puzzle, list) => {
  return ((typeof puzzle === "string") && (list instanceof Array))
}

const validLine = (line, list) => {
  const exp = /^[201.]+$/
  let count = 0
  for (let elem of line.split('\n')) {
    if (!exp.test(elem)) {
      return false
    }
    [...elem].map(num => num !== '.' ? count += +num : 0)
  }
  return (count === list.length)
}

const canPlace = (tab, screen, word, x, y, direction) => {
  if (direction === "row") {
    if (y + word.length > tab[0].length) return false;
    for (let i = 0; i < word.length; i++) {
      if (screen[x][y + i] == ".") return false;
      if (tab[x][y + i] != "." && tab[x][y + i] != word[i]) return false;
    }
  } else {
    if (x + word.length > tab.length) return false;
    for (let i = 0; i < word.length; i++) {
      if (screen[x + i][y] == ".") return false;
      if (tab[x + i][y] != "." && tab[x + i][y] != word[i]) return false;
    }
  }
  return true;
}

const placeWord = (tab, word, x, y, direction) => {
  const backup = [];
  if (direction == "row") {
    for (let i = 0; i < word.length; i++) {
      backup.push(tab[x][y + i]);
      tab[x][y + i] = word[i];
    }
  } else {
    for (let i = 0; i < word.length; i++) {
      backup.push(tab[x + i][y]);
      tab[x + i][y] = word[i];
    }
  }
  return backup;
}

const placeWordBack = (tab, word, x, y, direction) => {
  if (direction == "row") {
    for (let i = 0; i < word.length; i++) {
      tab[x][y + i] = word[i];
    }
  } else {
    for (let i = 0; i < word.length; i++) {
      tab[x + i][y] = word[i];
    }
  }
};

const append = (array, ...obj) => {
  return [...array, ...obj];
}

const groupWord = (screen, list, x, y) => {
  let screeList = [...list];
  let res = [];
  let num = 1 * screen[x][y];
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
  return res;
}

const solvePuzzle = (tab, words, screen, x, y) => {
  if (x == tab.length - 1 && y == tab[tab.length - 1].length - 1) {
    let solution = tab.map((arr) => arr.join("")).join("\n");
    if (results.length == 0) {
      results = append(results, solution);
    } else {
      results = [];
    }
    return false;
  }
  let skip = false;
  if (screen[x][y] != "0" && screen[x][y] != "." && tab[x][y] != ".") {
    for (const element of words) {
      if (element[0] == tab[x][y]) {
        skip = true;
      }
    }
    if (!skip) {
      return false;
    }
  }

  const nextP1 = y + 1 == tab[0].length ? x + 1 : x;
  const nextP2 = y + 1 == tab[0].length ? 0 : y + 1;
  if (screen[x][y] == "0" || screen[x][y] == ".") {
    return solvePuzzle(tab, words, screen, nextP1, nextP2);
  }
  let index = 0;
  let len = 0;
  for (const word of words) {
    if (canPlace(tab, screen, word, x, y, "row")) {
      let backup = [];
      let backup1 = [];
      let backup2 = [];
      let res = groupWord(screen, words, x, y);
      len = res.length;
      if (screen[x][y] == "2") {
        backup1 = placeWord(tab, res[index][0], x, y, "row");
        backup2 = placeWord(tab, res[index][1], x, y, "col");
      } else {
        backup = placeWord(tab, word, x, y, "row");
      }
      if (
        solvePuzzle(
          tab,
          words.filter((w) => {
            if (screen[x][y] == "2") {
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
      if (screen[x][y] == "2") {
        placeWordBack(tab, backup1, x, y, "row");
        placeWordBack(tab, backup2, x, y, "col");
      } else {
        placeWordBack(tab, backup, x, y, "row");
      }
      backup = [];
      backup1 = [];
      backup2 = [];
    }
    if (canPlace(tab, screen, word, x, y, "col")) {
      let backup = [];
      let backup1 = [];
      let backup2 = [];
      let res = groupWord(screen, words, x, y);
      if (screen[x][y] == "2") {
        backup1 = placeWord(tab, res[index][1], x, y, "row");
        backup2 = placeWord(tab, res[index][0], x, y, "col");
      } else {
        backup = placeWord(tab, word, x, y, "col");
      }
      if (
        solvePuzzle(
          tab,
          words.filter((w) => {
            if (screen[x][y] == "2") {
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
      if (screen[x][y] == "2") {
        placeWordBack(tab, backup1, x, y, "row");
        placeWordBack(tab, backup2, x, y, "col");
      } else {
        placeWordBack(tab, backup, x, y, "col");
      }
      backup = [];
      backup1 = [];
      backup2 = [];
    }
    if (index < len - 1) {
      index++;
    }
  }
  return false;
};

const crosswordSolver = (epuzzle, list) => {
  if (!validParams(epuzzle, words) || !validList(list) || !validLine(epuzzle, list)) {
    return console.log("ERROR")
  }
  list = list.map(elem => elem.toLowerCase())
  let tab = epuzzle.split("\n").map((row) => row.split(""))
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
      console.log("Error");
      return false;
    }
  }
  solvePuzzle(screen, list, tab, 0, 0);
  if (results.length != 0) {
    console.log(results[0]);
  } else {
    console.log("Error")
  }
}

const puzzle = '2001\n0..0\n1000\n0..0'
const words = ['casa', 'alan', 'ciao', 'anta']
crosswordSolver(puzzle, words);
