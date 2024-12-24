const canPlace = (tab, screen, word, p1, p2, direction) => {
  if (direction == "row") {
    console.log("hhh", screen[p2].slice(p2).length);
    if (p2 + word.length > screen[p2].slice(p2).length) return false;
    for (let i = 0; i < word.length; i++) {
      if (screen[p1][p2 + i] == "." && tab[p1][p2 + i] != word[i]) return false;
    }
  } else {
    console.log("hhh2222", p1 + word.length > screen.length);
    if (p1 + word.length > screen.length) return false;
    for (let i = 0; i < word.length; i++) {
      if (screen[p1 + i][p2] == "." && tab[p1 + i][p2] != word[i]) return false;
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
  console.log("#################");
  console.log(tab, words, screen, p1, p2);
  console.log("#################");

  if (p1 == tab.length - 1 && p2 == tab[tab.length - 1].length - 1) {
    console.log("finish");
    console.log(tab);
    return true;
  }

  //
  let skip = false;
  if (screen[p1][p2] != "0" && screen[p1][p2] != "." && tab[p1][p2] != ".") {
    console.log("lllllllllllllllllll");
    for (const element of words) {
      if (element[0] == tab[p1][p2]) {
        skip = true;
      }
    }
    if (!skip) {
      console.log("jjj");
      return false;
    }
  }
  //

  const nextP1 = p2 + 1 == tab[0].length ? p1 + 1 : p1;
  const nextP2 = p2 + 1 == tab[0].length ? 0 : p2 + 1;
  if (screen[p1][p2] == "0" || screen[p1][p2] == ".") {
    return solvePuzzle(tab, words, screen, nextP1, nextP2); // Skip non-fillable spots
  }

  console.log("das hna");
  for (const word of words) {
    if (canPlace(tab, word, p1, p2, "row")) {
      let backup = [];
      let backup1 = [];
      let backup2 = [];
      let res = groupWord(screen, words, p1, p2); // [[casa,ciao][]]
      if (screen[p1][p2] == "2") {
        backup1 = placeWord(tab, res[0][0], p1, p2, "row");
        backup2 = placeWord(tab, res[0][1], p1, p2, "col");
      } else {
        backup = placeWord(tab, word, p1, p2, "row");
      }
      console.log("backup", backup);
      if (
        solvePuzzle(
          tab,
          words.filter((w) => w != word && w != res[0][1]),
          screen,
          nextP1,
          nextP2
        )
      ) {
        return true;
      }
      if (screen[p1][p2] == "2") {
        placeWord(tab, backup1, p1, p2, "row");
        placeWord(tab, backup2, p1, p2, "col");
      } else {
        placeWord(tab, backup, p1, p2, "row");
      }
      backup = [];
      backup1 = [];
      backup2 = [];
    }

    if (canPlace(tab, word, p1, p2, "col")) {
      let backup = [];
      let backup1 = [];
      let backup2 = [];
      let res = groupWord(screen, words, p1, p2);
      if (screen[p1][p2] == "2") {
        //

        //
        backup1 = placeWord(tab, res[0][1], p1, p2, "row");
        backup2 = placeWord(tab, res[0][0], p1, p2, "col");
      } else {
        backup = placeWord(tab, word, p1, p2, "col");
      }
      backup1 = [];
      backup2 = [];
      if (
        solvePuzzle(
          tab,
          words.filter((w) => w != res[0][1] && w != word),
          screen,
          nextP1,
          nextP2
        )
      )
        return true;
      if (screen[p1][p2] == "2") {
        placeWord(tab, backup1, p1, p2, "col");
        placeWord(tab, backup2, p1, p2, "col");
      } else {
        placeWord(tab, backup, p1, p2, "col");
      }
      backup = [];
      backup1 = [];
      backup2 = [];
    }
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

const emptyPuzzle = `2001
0..0
1000
0..0`;
const words = ["alan", "ciao", "casa", "anta"];

crosswordSolver(emptyPuzzle, words);
