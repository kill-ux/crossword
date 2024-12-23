//append
const append = (array, ...obj) => {
  let newarr = [...array];
  for (let item of obj) {
    newarr[newarr.length] = item;
  }
  return newarr;
};
const crosswordSolver = (epuzzle, list) => {
  let tab = epuzzle.split("\n");
  let screen = [];
  for (const element of epuzzle.split("\n")) {
    screen = append(screen, element.split(""));
  }
  console.log(screen);
  let len = tab.length || [];
  let index = 0;
  for (let item of tab) {
    if (item.length != len) {
      return "Error";
    }
    tab[index] = "....";
    index++;
  }
  return Fill(tab, screen, list, 0, 0);
};

const groupWord = (screen,screeList,p1,p2) => {
  let res = [];
  let num = 1 * screen[p1][p2];
  //
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
  for (const element of res) {
    for (const e of element) {
      
    }
  }
  //
  
  //
  return res
};

const Fill = (tab, screen, list, p1, p2) => {
  let screeList = [...list];
  let res = groupWord(screen,screeList,p1,p2)
  console.log(res)

  //
};

const emptyPuzzle = `2001
0..0
1000
0..0`;
const words = ["alan", "casa", "ciao", "anta"];

crosswordSolver(emptyPuzzle, words);
