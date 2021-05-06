import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { boosterPack, buyBoosterFC } from '../../services/card_store'
import CardDisplay from '../CardDisplay';
import styles from './CardStore.module.css'

const rng = (max) => {
    return Math.floor(Math.random() * max)
}

const CardStore = ({cards}) => {
    const user = useSelector(state => state.session.user);
    const [freeCurrency, setFreeCurrency] = useState(user.free_currency);
    const [newPack, setNewPack] = useState(null)

    const fcPullBooster = async () => {
        if(freeCurrency >= 500){
            await buyBoosterFC(user.id)
            setFreeCurrency((prev) => prev - 500);
            const pack = []
            const ids = []
            for(let i = 0; i < 5; i++){
                const roll = rng(100)
                if(roll <= 40){
                    pack.push(cards.r0[rng(cards.r0.length)])
                    ids.push(cards.r0[rng(cards.r0.length)].id)
                }
                if(roll > 40 && roll <= 65){
                    pack.push(cards.r1[rng(cards.r1.length)])
                    ids.push(cards.r1[rng(cards.r1.length)].id)
                }
                if(roll > 65 && roll <= 80){
                    pack.push(cards.r2[rng(cards.r2.length)])
                    ids.push(cards.r2[rng(cards.r2.length)].id)
                }
                if(roll > 80 && roll <= 95){
                    pack.push(cards.r3[rng(cards.r3.length)])
                    ids.push(cards.r3[rng(cards.r3.length)].id)
                }
                if(roll > 95){
                    pack.push(cards.r4[rng(cards.r4.length)])
                    ids.push(cards.r4[rng(cards.r4.length)].id)
                }
            }
            await boosterPack(ids)
            setNewPack(pack)
        }
    }

    return (
        <div>
            <h2>Card Store</h2>
            <h4>${freeCurrency}</h4>
            <div>
                <h3>Purchase Booster Pack for $500</h3>
                <button onClick={fcPullBooster} disabled={freeCurrency < 500}>Buy Booster</button>
                <div className={styles.newPackDisplay}>
                    {newPack && newPack.map(card => 
                        (
                            <CardDisplay card={card} />
                        ))}
                </div>
            </div>
        </div>
    )
}

export default CardStore;