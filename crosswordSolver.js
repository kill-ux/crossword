//append
const append = (array, ...obj) => {
  return [...array, ...obj];
};

const crosswordSolver = (epuzzle, list) => {
  let tab = epuzzle.split("\n");
  let screen = [];
  for (const element of tab) {
    screen = append(screen, element.split(""));
  }
  let len = tab[0].length;
  let index = 0;
  for (let item of tab) {
    if (item.length !== len) {
      return "Error";
    }
    tab[index] = "....";
    index++;
  }
  let screeList = [...list];
  let res = groupWord(list, tab, screen, screeList, 0, 0, len);
};

const FillTab = (tab, p1, p2, d, word) => {
  //tab[index]
  if (d == "row") {
    tab[p1] = word;
    console.log("fill", tab[p1]);
  } else {
    for (let index = 0; index < tab.length; index++) {
      for (let y = 0; y < tab[index].length; y++) {
        if (y == p2) {
          tab[index][y] = word[y];
        }
      }
    }
  }
  return tab;
};

const backTab = (arr, p1, p2, d, word) => {
  let tab = [...arr];
  //tab[index]
  if (d == "row") {
    tab[p1] = "....";
  } else {
    for (let index = 0; index < tab.length; index++) {
      for (let y = 0; y < tab[index].length; y++) {
        if (y == p2) {
          tab[index][y] = ".";
        }
      }
    }
  }
  return tab;
};

const removeword = () => {
  
}

const groupWord = (list, tab, screen, screeList, p1, p2, len) => {
  console.log("screeList",screeList)
  console.log(tab);
  console.log(screen);
  if (p1 == len - 1 && p2 == len - 1) {
    return true;
  }
  let res = [];
  let num = +screen[p1][p2];
  if (num == 1 || num == 2) {
    for (const w1 of screeList) {
      let temp = [];
      for (let i = 0; i < screeList.length; i++) {
        if (w1[0] === screeList[i][0]) {
          temp = append(temp, screeList[i]);
          screeList = append(screeList.slice(0, i), ...screeList.slice(i + 1));
          i--;
        }
      }
      if (temp.length >= num) {
        res = append(res, temp);
      }
    }

    screeList = list
    let index = 0;
    console.log(res);
    for (const element of res) {
      for (const e of element) {
        for (const scr of screen[0]) {
          if (index != p2 && scr != 0 && scr != ".") {
            if (screen[p1][p2 + 1] != undefined && screen[p1][p2 + 1] != ".") {
              console.log("screeList?????",screeList)
              screeList = removeword(screeList,e)
              FillTab(tab, p1, p2, "row", e);
            } else {
              FillTab(tab, p1, p2, "col", e);
            }
            if (p2 != len - 1) {
              if (groupWord(list, tab, screen, screeList, p1, p2++, len)) {
                return true;
              }
            } else {
              if (groupWord(list, tab, screen, screeList, p1++, p2, len)) {
                return true;
              }
            }
            screeList = append(screeList,w)
            if (screen[p1][p2 + 1] != undefined && screen[p1][p2 + 1] != ".") {
              backTab(tab, p1, p2, "row", e);
            } else {
              backTab(tab, p1, p2, "row", e);
            }
          }
          index++;
        }
        index = 0;
      }
    }

    return res;
  }
};

const emptyPuzzle = `2001
0..0
1000
0..0`;
const words = ["alan", "casa", "ciao", "anta"];

crosswordSolver(emptyPuzzle, words);
