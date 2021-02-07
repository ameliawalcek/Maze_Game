import endAudioFile from '../assets/audio/level_end.mp3'
import mazeAudioFile from '../assets/audio/maze.mp3'

export const endAudio = new Audio(endAudioFile)
export const gameAudio = new Audio(mazeAudioFile)

export const UP = 38
export const DOWN = 40
export const LEFT = 37
export const RIGHT = 39
export const ENTER = 13
export const ARROWS = [UP, DOWN, LEFT, RIGHT]

export const MOVE = 'MOVE'
export const DECREMENT_TIME = 'DECREMENT_TIME'
export const START_GAME = 'START_GAME'
export const COMPLETE_LEVEL = 'COMPLETE_LEVEL'
export const GAME_OVER = 'GAME_OVER'

export const BONUS = 'BONUS'
export const LOLLIPOP = 'LOLLIPOP'
export const ICE_CREAM = 'ICE_CREAM'

export const ROUND_TIME = 31
export const LOLLIPOP_TIMER = 15
export const ICE_CREAM_TIMER = 30
export const ROWS = 17
export const COLS = 33

export const INITIAL_STATE = {
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
}
