import { UP, DOWN, LEFT, RIGHT, MOVE, COMPLETE_LEVEL, ROUND_TIME, DECREMENT_TIME, BONUS, START_GAME, GAME_OVER, ICE_CREAM, LOLLIPOP } from '../constants/constants'
import { checkIntersect } from '../utils/utils'

function reducer(state, action) {
    const { time, highScore, maze, goal, currentCell, points, round, gameOver } = state

    switch (action.type) {
        case START_GAME: {
            return {
                ...state,
                maze: action.payload.maze,
                round: gameOver ? 1 : action.payload.round,
                currentCell: action.payload.maze.startCell,
                time: time > ROUND_TIME ? time : ROUND_TIME,
                points: points,
                lollipopCell: null,
                iceCreamCell: null,
                renderLollipop: false,
                renderIceCream: false,
                gameOver: false,
                goal: false
            }
        }
        case DECREMENT_TIME: {
            return {
                ...state,
                time: time - 1
            }
        }
        case GAME_OVER: {
            return {
                ...state,
                highScore: Math.max(highScore, points),
                round: 0,
                points: 0,
                gameOver: true
            }
        }
        case COMPLETE_LEVEL: {
            const updatePoints = points + (round * time * 100)
            return {
                ...state,
                points: updatePoints,
            }
        }
        case BONUS: {
            let newState
            switch (action.payload.bonus) {
                case LOLLIPOP: {
                    newState = {
                        ...state,
                        time: time + 15,
                        points: points + 5000,
                        renderLollipop: true,
                        lollipopCell: null
                    }
                    break
                }
                case ICE_CREAM: {
                    newState = {
                        ...state,
                        time: time + 30,
                        points: points + 10000,
                        renderIceCream: true,
                        iceCreamCell: null
                    }
                    break
                }
                default:
                    throw new Error("Not a valid bonus")
            }
            return { ...newState }
        }
        case MOVE:
            if (!time || goal) return state

            if (checkIntersect(currentCell, maze.endCell)) {
                return { ...state, goal: true }
            }

            let newCell
            switch (action.payload.direction) {
                case UP:
                    if (!maze.cells[currentCell[0] + currentCell[1] * maze.cols][0]) {
                        newCell = [currentCell[0], currentCell[1] - 1]
                    }
                    break
                case RIGHT:
                    if (!maze.cells[currentCell[0] + currentCell[1] * maze.cols][1]) {
                        newCell = [currentCell[0] + 1, currentCell[1]]
                    }
                    break
                case DOWN:
                    if (!maze.cells[currentCell[0] + currentCell[1] * maze.cols][2]) {
                        newCell = [currentCell[0], currentCell[1] + 1]
                    }
                    break
                case LEFT:
                    if (!maze.cells[currentCell[0] + currentCell[1] * maze.cols][3]
                        && (!(currentCell[0] === 0 && currentCell[1] === 0))) {
                        newCell = [currentCell[0] - 1, currentCell[1]]
                    }
                    break
                default:
                    throw new Error("Unknown direction")
            }
            return {
                ...state,
                currentCell: newCell || currentCell,
                points: newCell ? points + 10 : points
            }
        default:
            throw new Error("Unknown action please try again")
    }
}

export default reducer