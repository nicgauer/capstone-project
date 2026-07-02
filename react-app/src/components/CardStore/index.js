import React from 'react';
import CardStore from './CardStore';
import Navigation from '../Navigation';
import styles from './CardStore.module.css';


const CardStoreWrapper = () => {
    return (
        <div>
            <Navigation currentLocation={'store'} />
            <div className={styles.storeWrapper}>
                <CardStore />
            </div>
        </div>
    )
}

export default CardStoreWrapper;
