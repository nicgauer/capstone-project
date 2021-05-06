import React, {useState, useEffect} from 'react';
import CardDisplay from '../CardDisplay';
import styles from './CollectionDisplay.module.css';

const CollectionDisplay = ({cards}) => {
    return (
        <div className={styles.collectionWrapper}>
            {cards.map(card => <CardDisplay card={card.card_type} />)}
        </div>
    )
}

export default CollectionDisplay;