import React, {useEffect, useState} from 'react';
import styles from './CardDisplay.module.css';


const CardDisplay = ({card}) => {
    return (
        <div className={styles.cardWrapper}>
            <div className={styles.infoWrapper}>
                <div className={styles.infoContainer}>
                    <h3 className={styles.cardName}>{card.name}</h3>
                    <h3 className={styles.cardType}>{card.type}</h3>
                </div>
                <img src={card.picture_url} className={styles.cardImage} />
                {card.evolution_name && <h4>Evolves from {card.evolution_name}</h4>}
            </div>
            <p>{card.description}</p>
                {card.type === 'unit' && (
                    <div className={styles.statWrapper}>
                        <h5>Att-{card.attack} </h5>
                        <h5>Def-{card.defense}</h5>
                    </div>
                )}
            
        </div>
    )
}

export default CardDisplay