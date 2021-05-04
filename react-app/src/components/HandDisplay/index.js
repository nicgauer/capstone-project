import React, { useState, useEffect } from 'react';
import CardDisplay from '../CardDisplay';
import styles from './HandDisplay.module.css'


const HandDisplay = ({ hand }) => {
    return (
        <div className={styles.handWrapper}>
            {hand && hand.map(card => (
                <CardDisplay card={card} />
            )) }
        </div>
    )
}

export default HandDisplay;