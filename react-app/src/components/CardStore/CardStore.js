import React, {useState, useEffect, useMemo} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { buyBooster, getStoreCards, buyCard } from '../../services/card_store'
import { setSessionUser } from '../../store/session';
import CardDisplay from '../CardDisplay';
import { Modal } from '../../context/Modal';
import styles from './CardStore.module.css'
import {NavLink} from 'react-router-dom'

const RARITY_PRICE = {0: 100, 1: 250, 2: 500, 3: 1000, 4: 2000};
const RARITY_LABEL = {0: 'Common', 1: 'Uncommon', 2: 'Rare', 3: 'Super Rare', 4: 'Legendary'};
const PAGE_SIZE = 100;

const CardStore = () => {
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [newPack, setNewPack] = useState(null)
    const [showModal, setShowModal] = useState(false);

    const [storeCards, setStoreCards] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [rarityFilter, setRarityFilter] = useState('all');
    const [page, setPage] = useState(0);
    const [feedback, setFeedback] = useState('');

    const freeCurrency = user.free_currency;

    useEffect(() => {
        getStoreCards().then(res => {
            if (res.cards) setStoreCards(res.cards);
        });
    }, []);

    const filtered = useMemo(() => {
        const q = nameFilter.trim().toLowerCase();
        return storeCards.filter(c =>
            c.name.toLowerCase().includes(q) &&
            (typeFilter === 'all' || c.type === typeFilter) &&
            (rarityFilter === 'all' || c.rarity === Number(rarityFilter))
        );
    }, [storeCards, nameFilter, typeFilter, rarityFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageCards = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    useEffect(() => { setPage(0); }, [nameFilter, typeFilter, rarityFilter]);

    useEffect(() => {
        if (page > totalPages - 1) setPage(totalPages - 1);
    }, [page, totalPages]);

    const fcPullBooster = async () => {
        const res = await buyBooster();
        if (res.errors) {
            return;
        }
        dispatch(setSessionUser(res.user));
        setNewPack(res.cards);
        setShowModal(true);
    }

    const handleBuyCard = async (ct) => {
        const res = await buyCard(ct.id);
        if (res.errors) {
            return;
        }
        dispatch(setSessionUser(res.user));
        setFeedback(`Purchased ${ct.name}!`);
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

                <div className={styles.singleCardSection}>
                    <h3>Buy Individual Cards</h3>
                    {feedback && <p className={styles.feedback}>{feedback}</p>}
                    <div className={styles.storeFilters}>
                        <input
                            className={styles.filterInput}
                            type="text"
                            placeholder="Search by name"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)} />
                        <select
                            className={styles.filterSelect}
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}>
                            <option value={"all"}>All Types</option>
                            <option value={"unit"}>Units</option>
                            <option value={"spell"}>Spells</option>
                        </select>
                        <select
                            className={styles.filterSelect}
                            value={rarityFilter}
                            onChange={(e) => setRarityFilter(e.target.value)}>
                            <option value={"all"}>All Rarities</option>
                            <option value={"0"}>Common</option>
                            <option value={"1"}>Uncommon</option>
                            <option value={"2"}>Rare</option>
                            <option value={"3"}>Epic</option>
                            <option value={"4"}>Legendary</option>
                        </select>
                    </div>
                    <h5>{filtered.length} cards</h5>
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageButton}
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}>Prev</button>
                            <span>Page {page + 1} of {totalPages}</span>
                            <button
                                className={styles.pageButton}
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}>Next</button>
                        </div>
                    )}
                    <div className={styles.storeListWrapper}>
                        {pageCards.map(ct => {
                            const price = RARITY_PRICE[ct.rarity];
                            return (
                                <div key={ct.id} className={styles.storeCard}>
                                    <CardDisplay card={ct} />
                                    <h5>{RARITY_LABEL[ct.rarity]} — ${price}</h5>
                                    <button
                                        className={freeCurrency < price ? styles.boosterButtonDisabled : styles.boosterButton}
                                        disabled={freeCurrency < price}
                                        onClick={() => handleBuyCard(ct)}>
                                        {freeCurrency < price ? `Need $${price - freeCurrency} more!` : 'Purchase'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
        </div>
    )
}

export default CardStore;
