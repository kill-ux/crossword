const emptyPuzzle = `2001
0..0
1000
0..0`
const words = ['alan','casa', 'ciao', 'anta']

let details = {}

const validPzzl = (list) => {
    const unique = new Set(list)
    const arrLen = [...unique].map(elem => elem.length)
    return arrLen.length === list.length ? Math.max(...arrLen) : 0
}

const validParams = (emptyP, list) => {
    return ((typeof emptyP === "string") && (list instanceof Array))
}

const catchError = (emptyP, list) => {
    const exp = /^[.201]+$/
    emptyP = emptyP.split("\n")
    const lineLen = emptyP[0].length
    console.log(emptyP[0], emptyP)
    for (const line of emptyP) {
        if (!exp.test(line)) {
            return "Error"
        }
        if (lineLen !== line.length) {
            return "Error"
        }
        const wrdLen = validPzzl(list)
        if ((wrdLen > line.length) || (wrdLen === 0) || (list.length > emptyP.length)) {
            console.log('test')
            return "Error"
        }
    }
    return
}
const createGrid = () => {
    let maxRow = 4
    let maxCol = 4
    const baseGrid = Array.from({ length: maxRow }, () => Array(maxCol).fill('.'))
    details.freeSlots.forEach((detail, index) => {
        const word = words[index]
        switch (true) {
            case (detail.direction === 'H'):
                for (let i = 0; i < detail.len; i++) {
                    baseGrid[detail.row][detail.col + i] = word[i]
                }
                break
            case detail.direction === 'V':
                for (let i = 0; i < detail.len; i++) {
                    baseGrid[detail.row + i][detail.col] = word[i]
                }
                break
        }
    })
    return baseGrid
}
const isValidSlot = (words, slotLen) => {
    // let count = 0
    // if (slotLen >= 2) {
    //     for (let i = 0; i < words.length; i++) {
    //         if (slotLen == words[i].length) {
    //             count++
    //         }
    //     }
    //     if (count > 0) {
    //         return true
    //     }
    // }
    
    return false
}
const crosswordSolver = (emptyPuzzle, words) => {
    details.freeSlots = []
    puzzle = emptyPuzzle.split("\n").map(row => row.split(''))
    console.log(puzzle)
    let rows = puzzle.length
    let cols = puzzle[0].length
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let hLength = 0
            let startCol = j
            while (startCol < cols && (puzzle[i][startCol] !== '.')) {
                hLength++
                startCol++
            }
            if (isValidSlot(words, hLength)) {
                details.freeSlots.push({
                    row: i,
                    col: j,
                    len: hLength,
                    direction: 'H'
                })
            }
            let vLength = 0
            let startRow = i
            while (startRow < rows && (puzzle[startRow][j] !== '.')) {
                vLength++
                startRow++
            }
            if (isValidSlot(words, vLength)) {
                details.freeSlots.push({
                    row: i,
                    col: j,
                    len: vLength,
                    direction: 'V'
                })
            }
        }
    }
    console.log("details ", details.freeSlots)
    console.log(createGrid())
    // createGrid()
}


crosswordSolver(emptyPuzzle, words)
