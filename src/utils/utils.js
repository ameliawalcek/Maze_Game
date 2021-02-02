import { ROWS, COLS } from '../constants/constants'

export const generateRandomCell = (currentCell) => {
    const cell = [
        Math.floor(Math.random() * COLS),
        Math.floor(Math.random() * ROWS)
    ]

    if (currentCell[0] === cell[0] && currentCell[1] === cell[1]) {
        generateRandomCell()
    }
    return cell
}

export const checkIntersect = (assetCellOne, assetCellTwo) => {
    if(assetCellOne[0] === assetCellTwo[0] && assetCellOne[1] === assetCellTwo[1]) return true
    return false
}