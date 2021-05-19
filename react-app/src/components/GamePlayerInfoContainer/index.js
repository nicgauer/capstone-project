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
        const [myTimeout, setMyTimeout] = useState(null);
        
        useEffect(() => {
            setDisHealth(health);
        }, [])

        useEffect(() => {
            countdownEffect(disHealth)
            return () => {
                if(myTimeout) clearTimeout(myTimeout)
            }
        }, [health])

        const countdownEffect = (current) => {
            if(myTimeout){
                clearTimeout(myTimeout)
            }

            if(health === current) {
                setGreen(false);
                setRed(false);
            }
            if(health > current){
                if(!green) setGreen(true);
                current += 10
                setDisHealth(current);
                let t = setTimeout(countdownEffect, 50, current);
                setMyTimeout(t);
            }else if(health < current){
                if(!red) setRed(true);
                current -= 10;
                setDisHealth(current);
                let t = setTimeout(countdownEffect, 50, current);
                setMyTimeout(t);
            }else{
                setGreen(false);
                setRed(false);
                if(myTimeout){
                    clearTimeout(myTimeout)
                }
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