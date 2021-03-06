import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { boosterPack, buyBoosterFC } from '../../services/card_store'
import CardDisplay from '../CardDisplay';
import { Modal } from '../../context/Modal';
import styles from './CardStore.module.css'
import {NavLink} from 'react-router-dom'

const rng = (max) => {
    return Math.floor(Math.random() * max)
}

const CardStore = ({cards}) => {
    const user = useSelector(state => state.session.user);
    const [freeCurrency, setFreeCurrency] = useState(user.free_currency);
    const [newPack, setNewPack] = useState(null)
    const [showModal, setShowModal] = useState(false);

    const fcPullBooster = async () => {
        if(freeCurrency >= 500){
            await buyBoosterFC(user.id)
            setFreeCurrency((prev) => prev - 500);
            const pack = []
            const ids = []
            for(let i = 0; i < 5; i++){
                const roll = rng(100)
                if(roll <= 40){
                    let result = cards.r0[rng(cards.r0.length)]
                    pack.push(result)
                    ids.push(result.id)
                }
                if(roll > 40 && roll <= 65){
                    let result = cards.r1[rng(cards.r1.length)]
                    pack.push(result)
                    ids.push(result.id)
                }
                if(roll > 65 && roll <= 80){
                    let result = cards.r2[rng(cards.r2.length)]
                    pack.push(result)
                    ids.push(result.id)
                }
                if(roll > 80 && roll <= 95){
                    let result = cards.r3[rng(cards.r3.length)]
                    pack.push(result)
                    ids.push(result.id)
                }
                if(roll > 95){
                    let result = cards.r4[rng(cards.r4.length)]
                    pack.push(result)
                    ids.push(result.id)
                }
            }
            await boosterPack(ids)
            setNewPack(pack)
            setShowModal(true);
        }
    }

    return (
        <div className={styles.storeContainer}>
                <h1>Welcome, {user.username}</h1>
                <h2>Card Store</h2>
                <h4>${freeCurrency}</h4>
                <div>
                    <h3>Purchase Booster Pack for $500</h3>
                    <button className={freeCurrency < 500 ? styles.boosterButtonDisabled : styles.boosterButton} onClick={fcPullBooster} disabled={freeCurrency < 500}>{freeCurrency < 500 ? `Need ${500 - freeCurrency} more $!` : "Buy Booster"}</button>
                    {newPack && showModal && (
                        <Modal onClose={() => setShowModal(false)}>
                        <div className={styles.newPackDisplay}>
                            {newPack.map(card => 
                                (
                                    <CardDisplay card={card} />
                                    ))}
                        </div>

                        <div className={styles.btnContainer}>
                            <NavLink to='/collection'>
                                <button className={styles.collectionLinkBtn}>Add Cards To Deck</button>
                            </NavLink>
                        </div>
                    </Modal>
                    )}
                </div>
        </div>
    )
}

export default CardStore;