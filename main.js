// const puzzle = `2001
// 0..0
// 1000
// 0..0`
const puzzle = ''
const words = 123
// const words = ['casa', 'ciao', 'alan', 'anta']
// const puzzle = `...1...........
// ..1000001000...
// ...0....0......
// .1......0...1..
// .0....100000000
// 100000..0...0..
// .0.....1001000.
// .0.1....0.0....
// .10000000.0....
// .0.0......0....
// .0.0.....100...
// ...0......0....
// ..........0....`
// const words = [
//     'sun',
//     'sunglasses',
//     'suncream',
//     'swimming',
//     'bikini',
//     'beach',
//     'icecream',
//     'tan',
//     'deckchair',
//     'sand',
//     'seaside',
//     'sandals',
// ]
let details = {}

const validList = (list) => {
    const unique = new Set(list)
    return [...unique].length === list.length
}

const validParams = (puzzle, list) => {
    return ((typeof puzzle === "string") && (list instanceof Array))
}
const validLine = (line) => {
    const exp = /^[201.]+$/
    for (let elem of line.split('\n')) {
        if (!exp.test(elem)) {
            return false
        }
    }
    return true
}
console.log("test ", validLine('2071'))

const createGrid = (puzzle) => {
    // let maxRow = puzzle.length
    // let maxCol = puzzle[0].length
    details.wordsInfo.forEach((detail, index) => {
        const word = words[index]
        switch (true) {
            case (detail.direction === 'H'):
                for (let i = 0; i < detail.len; i++) {
                    puzzle[detail.row][detail.col + i] = word[i]
                }
                break
            case detail.direction === 'V':
                for (let i = 0; i < detail.len; i++) {
                    puzzle[detail.row + i][detail.col] = word[i]
                }
                break
        }
    })
    return puzzle
}

const isValidSlot = (words, wordLen, base) => {
    let count = 0
    let arr = []
    details.startChar = {}
    if (wordLen >= 2) {
        for (let i = 0; i < words.length; i++) {
            const first = words[i][0]
            if (!details.startChar[first]) {
                details.startChar[first] = []
            }
            details.startChar[first].push(words[i])
            if (wordLen == words[i].length) {
                count++
                arr.push(words[i])
            }
        }
        if (count > 0) {
            console.log(details.startChar)
            return true
        }

    }
    return false
}

const printGrid = (grid) => {
    return grid.map(row => row.join('')).join('\n')
}

const crosswordSolver = (puzzle, words) => {
    if (!validParams(puzzle, words) || !validList(words) || !validLine(puzzle)) {
        return console.log("ERROR")
    }
    details.wordsInfo = []
    const splitPuzzle = puzzle.split("\n").map(row => row.split(''))
    console.log(splitPuzzle)
    let rows = splitPuzzle.length
    let cols = splitPuzzle[0].length
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let hLength = 0
            let startCol = j
            while (startCol < cols && (splitPuzzle[i][startCol] !== '.')) {
                hLength++
                startCol++
            }
            if (isValidSlot(words, hLength, splitPuzzle)) {
                details.wordsInfo.push({
                    row: i,
                    col: j,
                    len: hLength,
                    direction: 'H'
                })
            }
            let vLength = 0
            let startRow = i
            while (startRow < rows && (splitPuzzle[startRow][j] !== '.')) {
                vLength++
                startRow++
            }
            if (isValidSlot(words, vLength, splitPuzzle)) {
                details.wordsInfo.push({
                    row: i,
                    col: j,
                    len: vLength,
                    direction: 'V'
                })
            }
        }
    }
    console.log("details ", details.wordsInfo)
    console.log(createGrid(splitPuzzle))
    console.log(printGrid(createGrid(splitPuzzle)))
    // createGrid()
}


crosswordSolver(puzzle, words)