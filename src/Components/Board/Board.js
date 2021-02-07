import React, { useEffect, useRef, useState } from 'react'
import styles from './Board.module.css'
import PropTypes from 'prop-types'
import logoImage from '../../assets/images/logo.svg'
import lollipopImage from '../../assets/images/lollipop.svg'
import iceCreamImage from '../../assets/images/ice_cream.svg'
import useInterval from "@use-it/interval"
import { ICE_CREAM, LOLLIPOP } from '../../constants/constants'
import { checkIntersect } from '../../utils/utils'

function Board({ maze, currentCell, time, lollipopCell, iceCreamCell, handleBonus }) {
    const canvas = useRef(null)
    const container = useRef(null)

    const [ctx, setCtx] = useState(undefined)
    const [displayGoal, setDisplayGoal] = useState(true)
    const [displayIceCreamScore, setDisplayIceCreamScore] = useState({ display: false, location: null })
    const [displayLollipopScore, setDisplayLollipopScore] = useState({ display: false, location: null })

    const blockWidth = Math.floor(canvas.current?.width / maze?.cols)
    const blockHeight = Math.floor(canvas.current?.height / maze?.rows)
    const xOffset = Math.floor((canvas.current?.width - maze?.cols * blockWidth) / 2)
    const textSize = Math.min(blockWidth, blockHeight)
    const logoSize = 0.75 * Math.min(blockWidth, blockHeight)

    const displayImage = (cell, logo) => {
        const image = new Image(logoSize, logoSize)
        image.onload = () => {
            ctx.drawImage(
                image,
                cell[0] * blockWidth + xOffset + (blockWidth - logoSize) / 2,
                cell[1] * blockHeight + (blockHeight - logoSize) / 2,
                logoSize,
                logoSize
            )
        }
        image.src = logo
    }

    const displayText = (text, location) => {
        ctx.fillText(
            text,
            location[0] * blockWidth + xOffset + (blockWidth - textSize) / 2,
            location[1] * blockHeight + (blockHeight - textSize) / 2,
            textSize
        )
    }

    useEffect(() => {
        const fitToContainer = () => {
            const { offsetWidth, offsetHeight } = container.current

            canvas.current.width = offsetWidth
            canvas.current.height = offsetHeight
            canvas.current.style.width = offsetWidth + 'px'
            canvas.current.style.height = offsetHeight + 'px'
        }

        setCtx(canvas.current.getContext('2d'))
        setTimeout(fitToContainer, 0)
    }, [])

    useEffect(() => {
        if (!maze) return

        const drawLine = (x1, y1, width, height) => {
            ctx.strokeStyle = '#b2f7ef'
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x1 + width, y1 + height)
            ctx.stroke()
        }

        ctx.fillStyle = 'black'
        ctx.textBaseline = 'top'
        ctx.font = '20px "Joystix"'

        ctx.fillRect(0, 0, canvas.current.width, canvas.current.height)
        
        ctx.fillStyle = '#fd9ae4'

        for (let y = 0; y < maze.rows; y++) {
            for (let x = 0; x < maze.cols; x++) {
                const cell = maze.cells[x + y * maze.cols]
                if (y === 0 && cell[0]) {
                    drawLine(blockWidth * x + xOffset, blockHeight * y, blockWidth, 0)
                }
                if (cell[1]) {
                    drawLine(blockWidth * (x + 1) + xOffset, blockHeight * y, 0, blockHeight)
                }
                if (cell[2]) {
                    drawLine(blockWidth * x + xOffset, blockHeight * (y + 1), blockWidth, 0)
                }
                if (x === 0 && cell[3]) {
                    drawLine(blockWidth * x + xOffset, blockHeight * y, 0, blockHeight)
                }
            }
        }
        displayImage(currentCell, logoImage)

    }, [ctx, currentCell, maze, time])

    useEffect(() => {
        if (displayGoal && maze) displayText('GOAL!', maze.endCell)
    }, [displayGoal])

    useEffect(() => {
        if (lollipopCell) {
            displayImage(lollipopCell, lollipopImage)

            if (checkIntersect(lollipopCell, currentCell)) {
                setDisplayLollipopScore({ display: true, location: lollipopCell })
                setTimeout(() => setDisplayLollipopScore({ display: false, ...displayLollipopScore }), 3000)
                handleBonus(LOLLIPOP)
            }
        }

        if (iceCreamCell) {
            displayImage(iceCreamCell, iceCreamImage)

            if (checkIntersect(iceCreamCell, currentCell)) {
                setDisplayIceCreamScore({ display: true, location: iceCreamCell })
                setTimeout(() => setDisplayIceCreamScore({ display: false, ...displayLollipopScore }), 3000)
                handleBonus(ICE_CREAM)
            }
        }

        if (displayLollipopScore.display) {
            displayText("+5000", displayLollipopScore.location)
        }

        if (displayIceCreamScore.display) {
            displayText("+10000", displayIceCreamScore.location)
        }
    }, [time, currentCell, lollipopCell, iceCreamCell])

    useInterval(() => { setDisplayGoal((prevGoal) => !prevGoal) }, 800)

    return (
        <div className={styles.root} ref={container}        >
            <canvas ref={canvas} />
        </div>
    )
}

Board.propTypes = {
    maze: PropTypes.shape({
        cols: PropTypes.number.isRequired,
        rows: PropTypes.number.isRequired,
        cells: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.bool)).isRequired,
        currentCell: PropTypes.arrayOf(PropTypes.number)
    })
}

export default Board