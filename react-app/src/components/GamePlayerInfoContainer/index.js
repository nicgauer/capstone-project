import React from 'react';
import styles from './GamePlayerInfoContainer.module.css';

const GamePlayerInfoContainer = ({ 
    playerName, 
    handSize,
    deckSize,
    health
    }) => {
    return (
        <div className={styles.infoWrapper}>
            <h2>{playerName}</h2>
            <h4>Health - {health}</h4>
            <h5>Cards in Hand - {handSize}</h5>
            <h5>Cards in Deck - {deckSize}</h5>
        </div>
    )
}

export default GamePlayerInfoContainer;