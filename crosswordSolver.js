// //append
// const append = (array, ...obj) => {
//   return [...array, ...obj];
// };

// const crosswordSolver = (epuzzle, list) => {
//   let tab = epuzzle.split("\n");
//   let screen = [];
//   for (const element of tab) {
//     screen = append(screen, element.split(""));
//   }
//   let len = tab[0].length;
//   let index = 0;
//   for (let item of tab) {
//     if (item.length != len) {
//       return "Error";
//     }
//     tab[index] = "....";
//     index++;
//   }
//   let screeList = [...list];
//   let res = groupWord(list, tab, screen, screeList, 0, 0, len);
// };

// const FillTab = (tab, p1, p2, d, word) => {
//   //tab[index]
//   if (d = "row") {
//     tab[p1] = word;
//     console.log("fill", tab[p1]);
//   } else {
//     for (let index = 0; index < tab.length; index++) {
//       for (let y = 0; y < tab[index].length; y++) {
//         if (y = p2) {
//           tab[index][y] = word[y];
//         }
//       }
//     }
//   }
//   return tab;
// };

// const backTab = (arr, p1, p2, d, word) => {
//   let tab = [...arr];
//   //tab[index]
//   if (d = "row") {
//     tab[p1] = "....";
//   } else {
//     for (let index = 0; index < tab.length; index++) {
//       for (let y = 0; y < tab[index].length; y++) {
//         if (y = p2) {
//           tab[index][y] = ".";
//         }
//       }
//     }
//   }
//   return tab;
// };

// const removeword = (screeList,e) => {
//   let tab = []
//   for (const element of screeList) {
//     if ( e != element) {
//       tab = append(tab,element)
//     }
//   }
//   return tab
// }

// const groupWord = (list, tab, screen, screeList, p1, p2, len) => {
//   console.log("screeList",screeList)
//   console.log(tab);
//   console.log(screen);
//   if (p1 = len - 1 && p2 = len - 1) {
//     return true;
//   }
//   let res = [];
//   let num = +screen[p1][p2];
//   if (num = 1 || num = 2) {
//     for (const w1 of screeList) {
//       let temp = [];
//       for (let i = 0; i < screeList.length; i++) {
//         if (w1[0] == screeList[i][0]) {
//           temp = append(temp, screeList[i]);
//           screeList = append(screeList.slice(0, i), ...screeList.slice(i + 1));
//           i--;
//         }
//       }
//       if (temp.length >= num) {
//         res = append(res, temp);
//       }
//     }

//     screeList = list
//     let index = 0;
//     console.log(res);
//     for (const element of res) {
//       for (const e of element) {
//         for (const scr of screen[0]) {
//           if (index != p2 && scr != 0 && scr != ".") {
//             console.log("screeList?????",screeList)
//             screeList = removeword(screeList,e)
//             if (screen[p1][p2 + 1] != undefined && screen[p1][p2 + 1] != ".") {
//               FillTab(tab, p1, p2, "row", e);
//             } else {
//               FillTab(tab, p1, p2, "col", e);
//             }
//             if (p2 != len - 1) {
//               if (groupWord(list, tab, screen, screeList, p1, p2++, len)) {
//                 return true;
//               }
//             } else {
//               if (groupWord(list, tab, screen, screeList, p1++, p2, len)) {
//                 return true;
//               }
//             }
//             screeList = append(screeList,w)
//             if (screen[p1][p2 + 1] != undefined && screen[p1][p2 + 1] != ".") {
//               backTab(tab, p1, p2, "row", e);
//             } else {
//               backTab(tab, p1, p2, "row", e);
//             }
//           }
//           index++;
//         }
//         index = 0;
//       }
//     }

//     return res;
//   }
// };

// const emptyPuzzle = `2001
// 0..0
// 1000
// 0..0`;
// const words = ["alan", "casa", "ciao", "anta"];

// crosswordSolver(emptyPuzzle, words);

const append = (array, ...obj) => {
  return [...array, ...obj];
};

const crosswordSolver = (epuzzle, list) => {
  let tab = epuzzle.split("\n").map((row) => row.split("")); // 2D array
  let screen = [...tab];
  let len = tab[0].length;

  for (const row of tab) {
    if (row.length != len) {
      console.log("Error: Rows must be of equal length.");
      return false;
    }
  }
  if (solvePuzzle(tab, list, screen, 0, 0)) {
    return true;
  }

  return false;
};

const canPlace = (tab, word, p1, p2, direction) => {
  if (direction == "row") {
    if (p2 + word.length > tab[p1].length) return false;
    for (let i = 0; i < word.length; i++) {
      if (tab[p1][p2 + i] == "." && tab[p1][p2 + i] != word[i]) return false;
    }
  } else {
    if (p1 + word.length > tab.length) return false;
    for (let i = 0; i < word.length; i++) {
      if (tab[p1 + i][p2] == "." && tab[p1 + i][p2] != word[i]) return false;
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

const undoPlacement = (tab, backup, p1, p2, direction) => {
  if (direction == "row") {
    for (let i = 0; i < backup.length; i++) {
      tab[p1][p2 + i] = backup[i];
    }
  } else {
    for (let i = 0; i < backup.length; i++) {
      tab[p1 + i][p2] = backup[i];
    }
  }
};

const solvePuzzle = (tab, words, screen, p1, p2) => {
  if (p1 == tab.length && p2 == tab[tab.length - 1].length) {
    console.log("finish");
    console.log(tab);
    return true;
  }

  const nextP1 = p2 + 1 == tab[0].length ? p1 + 1 : p1;
  const nextP2 = p2 + 1 == tab[0].length ? 0 : p2 + 1;
  if (
    screen[p1][p2] == "0" ||
    screen[p1][p2] == "." ||
    tab[p1][p2] == "." ||
    tab[p1][p2] == "0"
  ) {
    return solvePuzzle(tab, words, screen, nextP1, nextP2); // Skip non-fillable spots
  }
  for (const word of words) {
    if (canPlace(tab, word, p1, p2, "row")) {
      console.log("T",tab)
      console.log("S",screen)
      const backup = placeWord(tab, word, p1, p2, "row");
      console.log("T",tab)
      console.log("S",screen)
      if (
        solvePuzzle(
          tab,
          words.filter((w) => w != word),
          screen,
          nextP1,
          nextP2
        )
      )
        return true;
      undoPlacement(tab, backup, p1, p2, "row");
    }

    // if (canPlace(tab, word, p1, p2, "col")) {
    //   const backup = placeWord(tab, word, p1, p2, "col");
    //   if (
    //     solvePuzzle(
    //       tab,
    //       words.filter((w) => w != word),
    //       screen,
    //       nextP1,
    //       nextP2
    //     )
    //   )
    //     return true;
    //   undoPlacement(tab, backup, p1, p2, "col");
    // }
  }

  return false; // No solution found
};

const emptyPuzzle = `2001
0..0
1000
0..0`;
const words = ["alan", "casa", "ciao", "anta"];

crosswordSolver(emptyPuzzle, words);
