import React, {useEffect, useState} from 'react';
import styles from './BoardCardDisplay.module.css';


const BoardCardDisplay = ({card}) => {
    return (
        <div className={styles.cardWrapper}>
            <div className={styles.infoWrapper}>
                <h3>{card.name}</h3>
                <img src={card.picture_url} className={styles.cardImage} />
            </div>
            <div className={styles.statWrapper}>
                {card.effect && (<h5>{card.effect}</h5>)}
                {card.type === 'unit' && (
                    <div>
                        <h5>Att-{card.attack} Def-{card.defense}</h5>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BoardCardDisplay