import { ROWS, COLS } from '../constants/constants'

export const checkIntersect = (assetCellOne, assetCellTwo) => {
    if(assetCellOne[0] === assetCellTwo[0] && assetCellOne[1] === assetCellTwo[1]) return true
    return false
}

export const generateRandomCell = (currentCell) => {
    const cell = [
        Math.floor(Math.random() * COLS),
        Math.floor(Math.random() * ROWS)
    ]

    if (checkIntersect(currentCell, cell)) {
        generateRandomCell()
    }
    return cell
}
