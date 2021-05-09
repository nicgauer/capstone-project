import React, {useEffect, useState} from 'react';
import styles from './CardDisplay.module.css';


const CardDisplay = ({card}) => {
    return (
        <div className={styles.cardWrapper}>
            <div className={styles.infoWrapper}>
                <h3>{card.name}</h3>
                <img src={card.picture_url} className={styles.cardImage} />
                <h4>{card.type}</h4>
                {card.evolution_name && <h4>Evolves from {card.evolution_name}</h4>}
            </div>
            <div className={styles.statWrapper}>
                {card.effect && (<h5>{card.effect}</h5>)}
                {card.type === 'unit' && (
                    <div>
                        <h5>Att-{card.attack} Def-{card.defense}</h5>
                    </div>
                )}
                <p>{card.description}</p>
            </div>
        </div>
    )
}

export default CardDisplay