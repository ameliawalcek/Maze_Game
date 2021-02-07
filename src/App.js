import React, { useCallback, useEffect, useReducer } from 'react'
import {
    INITIAL_STATE, ROWS, COLS, MOVE, LOLLIPOP_TIMER, ICE_CREAM_TIMER, ARROWS, ENTER,
    DECREMENT_TIME, START_GAME, GAME_OVER, BONUS, COMPLETE_LEVEL, endAudio, gameAudio
} from './constants/constants'
import { generateRandomCell } from './utils/utils'
import Notification from './Components/Notification/Notification'
import Header from './Components/Header/Header'
import Board from './Components/Board/Board'
import styles from './App.module.css'
import useInterval from "@use-it/interval"
import MazeGenerator from './maze/MazeGenerator'
import reducer from './reducers/reducers'

function App() {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

    const handleGameStart = useCallback(() => {
        if (!state.time) {
            gameAudio.loop = true
            gameAudio.play()
            dispatch({
                type: START_GAME,
                payload: {
                    maze: new MazeGenerator(ROWS, COLS).generate(),
                    round: state.round
                }
            })
        }
    }, [state.time])

    const handlePlayerMove = useCallback((direction) => {
        if (state.time !== 0) {
            dispatch({ type: MOVE, payload: { direction } })
        }
    }, [state.time])

    const handleBonus = useCallback((bonus) => {
        dispatch({ type: BONUS, payload: { bonus } })
    }, [state.time])

    const handleLevelChange = useCallback(() => {
        dispatch({ type: COMPLETE_LEVEL })
        dispatch({
            type: START_GAME, payload: {
                maze: new MazeGenerator(ROWS, COLS).generate(),
                round: state.round + 1,
            }
        })
        gameAudio.loop = true
        gameAudio.play()
    }, [state.time])

    useEffect(() => {
        const onKeyDown = e => {
            if (e.keyCode === ENTER) handleGameStart()
            if (ARROWS.includes(e.keyCode)) handlePlayerMove(e.keyCode)
        }

        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [handleGameStart])

    useInterval(() => {
        dispatch({ type: DECREMENT_TIME })
    }, state.time ? 1000 : null)

    useEffect(() => {
        if (state.time === LOLLIPOP_TIMER && !state.renderLollipop) {
            state.lollipopCell = generateRandomCell(state.currentCell)
        }
        if (state.time === ICE_CREAM_TIMER && !state.renderIceCream) {
            state.iceCreamCell = generateRandomCell(state.currentCell)
        }
    }, [state.time])

    useEffect(() => {
        if (state.goal && state.time) {
            gameAudio.load()
            endAudio.play()
            endAudio.addEventListener('ended', handleLevelChange)
            return () => {
                endAudio.removeEventListener('ended', handleLevelChange)
            }
        }
    }, [state.goal])

    useEffect(() => {
        if (!state.time) {
            gameAudio.load()
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
