import React, { useCallback, useEffect, useReducer } from 'react'
import { ROWS, COLS, MOVE, LOLLIPOP_TIMER, ICE_CREAM_TIMER, DIRECTIONS, DECREMENT_TIME, START_GAME, GAME_OVER, LOLLIPOP, BONUS, ICE_CREAM, COMPLETE_LEVEL } from './constants/constants'
import { generateRandomCell } from './utils/utils'
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
        goal: false,
        time: undefined,
        maze: undefined,
        currentCell: undefined,
        renderLollipop: false,
        renderIceCream: false,
        lollipopCell: null,
        iceCreamCell: null
    })

    const handleGameStart = useCallback(() => {
        if (!state.time) {
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
        if (bonus === LOLLIPOP && !state.renderLollipop) {
            state.renderLollipop = true
            state.lollipopCell = null
        }
        if (bonus === ICE_CREAM && !state.renderIceCream) {
            state.renderIceCream = true
            state.iceCreamCell = null
        }
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
    }, [state.time])

    useEffect(() => {
        const onKeyDown = e => {
            if (e.keyCode === 13) {
                handleGameStart()
            }
            if (DIRECTIONS.includes(e.keyCode)) {
                handlePlayerMove(e.keyCode)
            }
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
            // state.lollipopCell = [0, 1]
        }
        if (state.time === ICE_CREAM_TIMER && !state.renderIceCream) {
            state.iceCreamCell = generateRandomCell(state.currentCell)
            // state.iceCreamCell = [1, 0]
        }
    }, [state.time])

    useEffect(() => {
        if (state.goal && state.time) {
            handleLevelChange()
        }
    }, [state.goal])

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
