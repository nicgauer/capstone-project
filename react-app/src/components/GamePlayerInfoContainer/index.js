import React, {useEffect, useState, useRef} from 'react';
import styles from './GamePlayerInfoContainer.module.css';

const GamePlayerInfoContainer = ({
    playerName,
    handSize,
    deckSize,
    health
    }) => {
        const [disHealth, setDisHealth] = useState(health);
        const [red, setRed] = useState(false);
        const [green, setGreen] = useState(false);
        //Ref (not state) so cleanup always sees the latest pending timer
        const timeoutRef = useRef(null);

        useEffect(() => {
            countdownEffect(disHealth)
            return () => {
                if(timeoutRef.current) clearTimeout(timeoutRef.current)
            }
        }, [health])

        const countdownEffect = (current) => {
            if(timeoutRef.current){
                clearTimeout(timeoutRef.current)
            }

            if(health > current){
                if(!green) setGreen(true);
                current += 10
                setDisHealth(current);
                timeoutRef.current = setTimeout(countdownEffect, 50, current);
            }else if(health < current){
                if(!red) setRed(true);
                current -= 10;
                setDisHealth(current);
                timeoutRef.current = setTimeout(countdownEffect, 50, current);
            }else{
                setGreen(false);
                setRed(false);
            }
        }

        let styleObj = {color:"black"};
        if(red) {
            styleObj = {color:"red"}
        }else if (green){
            styleObj = {color:"green"}
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
