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