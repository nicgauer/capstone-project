import React, {useEffect, useState} from 'react';
import styles from './CardDisplay.module.css';


const CardDisplay = ({card}) => {

    return (
        <div className={styles.cardWrapper}>
            <div>
                <h3>{card.name}</h3>
            </div>
        </div>
    )
}

export default CardDisplay