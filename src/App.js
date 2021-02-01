import React, { useCallback, useEffect, useReducer } from 'react'
import { ROWS, COLS, MOVE, LOLLIPOP_TIMER, ICE_CREAM_TIMER, DIRECTIONS, DECREMENT_TIME, START_GAME, GAME_OVER, LOLLIPOP, BONUS, ICE_CREAM } from './constants/constants'
import Notification from './Components/Notification/Notification'
import Header from './Components/Header/Header'
import Board from './Components/Board/Board'
import styles from './App.module.css'
import useInterval from "@use-it/interval"
import MazeGenerator from './maze/MazeGenerator'
import reducer from './reducers/reducers'

function App() {
    const [state, dispatch] = useReducer(reducer, {
        points: 0,
        round: 1,
        highScore: 0,
        time: undefined,
        maze: undefined,
        currentCell: undefined,
        completeLevel: false,
        wasLollipop: false,
        wasIceCream: false,
        lollipopCell: null,
        iceCreamCell: null
    })

    const generateRandomCell = () => {
        const cell = [
            Math.floor(Math.random() * ROWS),
            Math.floor(Math.random() * COLS),
        ]

        if (state.currentCell[0] === cell[0]
            && state.currentCell[1] === cell[1]) {
            generateRandomCell()
        }
        return cell
    }

    const handleOnEnterKeyPressed = useCallback(() => {
        if (!state.time) {
            dispatch({
                type: START_GAME,
                payload: {
                    maze: new MazeGenerator(ROWS, COLS).generate()
                }
            })
        }
    }, [state.time])

    const handlePlayerMove = useCallback((direction) => {
        if (state.time !== 0) {
            dispatch({ type: MOVE, payload: { direction } })
        }
    }, [state.time])

    const handleBonus = (bonus) => {
        if (bonus === LOLLIPOP && !state.wasLollipop) {
            state.wasLollipop = true
            state.lollipopCell = null
            dispatch({ type: BONUS, payload: { bonus } })
        }
        if (bonus === ICE_CREAM && !state.wasIceCream) {
            state.wasIceCream = true
            state.iceCreamCell = null
            dispatch({ type: BONUS, payload: { bonus } })
        }
    }

    useEffect(() => {
        const onKeyDown = e => {
            if (e.keyCode === 13) {
                handleOnEnterKeyPressed()
            }
            if (DIRECTIONS.includes(e.keyCode)) {
                handlePlayerMove(e.keyCode)
            }
        }
        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [handleOnEnterKeyPressed])

    useInterval(() => {
        dispatch({ type: DECREMENT_TIME })
    }, state.time ? 1000 : null)

    useEffect(() => {
        if (state.time === LOLLIPOP_TIMER && !state.wasLollipop) {
            // state.lollipopCell = generateRandomCell()
            state.lollipopCell = [0, 1]
        }
        if (state.time === ICE_CREAM_TIMER && !state.wasIceCream) {
            // state.iceCreamCell = generateRandomCell()
            state.iceCreamCell = [1, 0]
        }
    }, [state.time])

    useEffect(() => {
        if (state.time === 0) {
            dispatch({ type: GAME_OVER })
        }
    }, [state.time])

    return (
        <div className={styles.root}>
            <Header
                highScore={state.highScore}
                points={state.points}
                time={state.time}
                round={state.round}
            />
            <Board
                maze={state.maze}
                currentCell={state.currentCell}
                time={state.time}
                lollipopCell={state.lollipopCell}
                iceCreamCell={state.iceCreamCell}
                handleBonus={handleBonus}
            />
            <Notification
                show={!state.time}
                gameOver={state.time === 0}
            />
        </div>
    )
}

export default App
