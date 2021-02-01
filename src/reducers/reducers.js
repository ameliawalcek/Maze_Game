import { UP, DOWN, LEFT, RIGHT, MOVE, ROUND_TIME, DECREMENT_TIME, START_GAME, END_GAME } from '../constants/constants'

function reducer(state, action) {
    const { time, highScore, maze, currentCell, points } = state

    switch (action.type) {
        case START_GAME: {
            return {
                ...state,
                maze: action.payload.maze,
                currentCell: action.payload.maze.startCell,
                time: ROUND_TIME
            }
        }
        case DECREMENT_TIME: {
            return {
                ...state,
                time: time - 1
            }
        }
        case END_GAME: {
            return {
                ...state,
                highScore: Math.max(highScore, points)
            }
        }
        case MOVE:
            let nextCell = undefined
            switch (action.payload.direction) {
                case UP:
                    if (!maze.cells[currentCell[0] + currentCell[1] * maze.cols][0]) {
                        nextCell = [currentCell[0], currentCell[1] - 1]
                    }
                    break
                case DOWN:
                    if (!maze.cells[currentCell[0] + currentCell[1] * maze.cols][2]) {
                        nextCell = [currentCell[0], currentCell[1] + 1]
                    }
                    break
                case LEFT:
                    if (!maze.cells[currentCell[0] + currentCell[1] * maze.cols][3]) {
                        nextCell = [currentCell[0] - 1, currentCell[1]]
                    }
                    break
                case RIGHT:
                    if (!maze.cells[currentCell[0] + currentCell[1] * maze.cols][1]) {
                        nextCell = [currentCell[0] + 1, currentCell[1]]
                    }
                    break
                default:
                    throw new Error("Unknown direction")
            }
            return {
                ...state,
                currentCell: nextCell || currentCell,
                points: nextCell ? points + 10 : points
            }
        default:
            throw new Error("Unknown action please try again")
    }
}


export default reducer