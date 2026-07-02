import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { buyBooster } from '../../services/card_store'
import { setSessionUser } from '../../store/session';
import CardDisplay from '../CardDisplay';
import { Modal } from '../../context/Modal';
import styles from './CardStore.module.css'
import {NavLink} from 'react-router-dom'

const CardStore = () => {
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [newPack, setNewPack] = useState(null)
    const [showModal, setShowModal] = useState(false);

    const freeCurrency = user.free_currency;

    const fcPullBooster = async () => {
        const res = await buyBooster();
        if (res.errors) {
            return;
        }
        dispatch(setSessionUser(res.user));
        setNewPack(res.cards);
        setShowModal(true);
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
                                    <CardDisplay key={card.id} card={card.card_type} />
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
