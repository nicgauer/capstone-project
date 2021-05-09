import React, {useEffect, useState} from 'react';
import styles from './GamePlayerInfoContainer.module.css';

const GamePlayerInfoContainer = ({ 
    playerName, 
    handSize,
    deckSize,
    health
    }) => {
        const [disHealth, setDisHealth] = useState();
        const [red, setRed] = useState(false);
        const [green, setGreen] = useState(false);
        
        useEffect(() => {
            setDisHealth(health);
        }, [])

        useEffect(() => {
            countdownEffect(disHealth)
        }, [health])

        const countdownEffect = (current) => {
            if(health === current) {
                setGreen(false);
                setRed(false);
            }
            if(health > current){
                if(!green) setGreen(true);
                current += 10
                setDisHealth(current);
                setTimeout(() => countdownEffect(current), 50);
            }
            if(health < current){
                if(!red) setRed(true);
                current -= 10;
                setDisHealth(current);
                setTimeout(() => countdownEffect(current), 50);
            }
        }

        let styleObj = {color:"black"};
        if(red) {
            styleObj = {color:"red"}
        }else if (green){
            styleObj = {color:"green"}
        }else {
            styleObj = {color:"black"}
        }


    return (
        <div className={styles.infoWrapper}>
            <h2>{playerName}</h2>
            <h4 style={styleObj}>Health - {disHealth}</h4>
            <h5>Cards in Hand - {handSize}</h5>
            <h5>Cards in Deck - {deckSize}</h5>
        </div>
    )
}

export default GamePlayerInfoContainer;