import React from 'react';
import styles from './Header.module.css';
import PropTypes from 'prop-types';

function Header({highScore, time, points, round}) {

    const formatTime = () => {
        return (time || time === 0)
            ? time.toString().padStart(2, ' ')
            : null
    };

    return (
        <header>
            <div className={styles.row}>
                <p>Welcome to the maze!</p>
                <p>HiGH-Score <span className={styles.score}>{highScore.toString().padStart(5, ' ')}</span></p>
            </div>
            <p>
                POINTS <span className={styles.score}>{points.toString().padStart(5, ' ')}</span>&nbsp;&nbsp;
                ROUND <span className={styles.score}>{round.toString().padStart(3, ' ')}</span>&nbsp;&nbsp;
                TIME <span className={styles.score}>{formatTime()}</span>
            </p>
        </header>
    );
}

Header.propTypes = {
    time: PropTypes.number,
    highScore: PropTypes.number.isRequired,
    points: PropTypes.number.isRequired,
    round: PropTypes.number.isRequired
};

export default Header;
