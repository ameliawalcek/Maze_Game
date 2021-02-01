import React, { useCallback, useEffect, useReducer } from 'react'
import { ROUND_TIME, ROWS, COLS, MOVE, DIRECTIONS, DECREMENT_TIME, START_GAME, END_GAME } from './constants/constants'
import styles from './App.module.css'
import useInterval from "@use-it/interval"
import Header from './Components/Header/Header'
import Notification from './Components/Notification/Notification'
import MazeGenerator from './maze/MazeGenerator'
import Board from './Components/Board/Board'
import reducer from './reducers/reducers'

function App() {
    const [state, dispatch] = useReducer(reducer, {
        points: 0,
        round: 1,
        highScore: 0,
        time: undefined,
        maze: undefined,
        currentCell: undefined
    })

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
            dispatch({
                type: MOVE, payload: { direction }
            })
        }
    }, [state.time])

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
        if (state.time === 0) {
            dispatch({ type: END_GAME })
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
            />
            <Notification
                show={!state.time}
                gameOver={state.time === 0}
            />
        </div>
    )
}

export default App
