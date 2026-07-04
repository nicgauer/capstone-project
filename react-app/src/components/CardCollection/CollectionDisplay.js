import React, {useState, useEffect, useMemo} from 'react';
import CardDisplay from '../CardDisplay';
import styles from './CollectionDisplay.module.css';
import { addCardToDeck, removeCardFromDeck, newDeck } from '../../services/deck';
import { Modal } from '../../context/Modal';
import Navigation from '../Navigation';
import { useSelector } from 'react-redux';

const PAGE_SIZE = 20;

const CollectionDisplay = ({cards}) => {
    const user = useSelector(state => state.session.user);
    //Local copy of the organized collection; handlers update it immutably
    const [collection, setCollection] = useState(() => ({...cards}))
    const [decks, setDecks] = useState([...cards.decks])
    const [dropdown, setDropdown] = useState('allCards')
    const [selectedDropdown, setSelectedDropdown] = useState(decks[0].id)
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newDeckModal, setNewDeckModal] = useState(false);
    const [newDeckName, setNewDeckName] = useState('New Deck');
    const [helpModal, setHelpModal] = useState(false);
    const [nameFilter, setNameFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [page, setPage] = useState(0);

    const filtered = useMemo(() => {
        const source = collection[dropdown] || [];
        const q = nameFilter.trim().toLowerCase();
        return source.filter(c =>
            c.card_type.name.toLowerCase().includes(q) &&
            (typeFilter === 'all' || c.card_type.type === typeFilter)
        );
    }, [collection, dropdown, nameFilter, typeFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageCards = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    useEffect(() => { setPage(0); }, [dropdown, nameFilter, typeFilter]);

    useEffect(() => {
        if (page > totalPages - 1) setPage(totalPages - 1);
    }, [page, totalPages]);

    const displaySelectHandler = (e) => {
        setDropdown(e.target.value);
        setSelected(null);
    }

    const selectHandler = (card) => {
        const asNum = Number(dropdown);
        if (!Number.isNaN(asNum) && decks.some(d => d.id === asNum)) {
            setSelectedDropdown(asNum);
        }
        setSelected(card)
        setShowModal(true)
    }

    const addToDeck = () => {
        addCardToDeck(selected.id, selectedDropdown)

        const moved = {...selected, deck_id: selectedDropdown};
        const newBox = collection.box.filter(c => c.id !== selected.id);
        setCollection(prev => ({
            ...prev,
            box: newBox,
            [selectedDropdown]: [...prev[selectedDropdown], moved],
            allCards: prev.allCards.map(c => c.id === moved.id ? moved : c),
        }));
        setSelected(null);
        setShowModal(false)
    }

    const removeFromDeck = () => {
        removeCardFromDeck(selected.id)

        const deckId = selected.deck_id;
        const moved = {...selected, deck_id: null};
        const newBox = [...collection.box, moved];
        setCollection(prev => ({
            ...prev,
            [deckId]: prev[deckId].filter(c => c.id !== selected.id),
            box: newBox,
            allCards: prev.allCards.map(c => c.id === moved.id ? moved : c),
        }));
        setSelected(null);
        setShowModal(false)
    }

    const deckName = (id) => {
        return decks[decks.findIndex(d => d.id === id)].name
    }

    const newDeckButtonHandler = () => {
        setSelected(null);
        setNewDeckModal(true);
        setShowModal(true);
    }

    const newDeckSubmitHandler = async (e) => {
        e.preventDefault();

        const nd = await newDeck(newDeckName)
        setCollection(prev => ({...prev, [nd.id]: []}));
        setDecks([...decks, nd]);
        setShowModal(false)
        setNewDeckModal(false)
        setDropdown(nd.id)
    }

    const deckModalCloseHandler = () => {
        setShowModal(false)
        setNewDeckModal(false)
    }

    const displayParser = () => {
        if(dropdown === 'allCards') return 'All Cards'
        if(dropdown === 'box') return 'Unassigned Cards'
        return deckName(Number(dropdown))
    }

    const amountInDeck = (cardTypeId, deckId = selectedDropdown) => {
        let count = 0;
        collection[deckId].forEach((c) => {
            if(c.card_type.id === cardTypeId){
                count++;
            }
        })
        return count
    }

    return (
        <div className={styles.container}>
            <div className={styles.collectionHeader}>
                <Navigation currentLocation={'collection'} />
                <div className={styles.headerInnerContainer}>
                    <div className={styles.leftSpacer}>
                        <select
                            className={styles.displaySelect}
                            value={dropdown}
                            onChange={displaySelectHandler}>
                            {decks.map(deck => <option key={deck.id} value={deck.id}>{deck.name}</option>)}
                            <option value={"allCards"}>All Cards</option>
                            <option value={"box"}>Unassigned Cards</option>
                        </select>
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
                    </div>
                    <div className={styles.centerSpacer}>
                        <h5 className={styles.displaying}>{displayParser()}</h5>
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
                    </div>
                    <div className={styles.rightSpacer}>
                        <button className={styles.newDeckButton} onClick={() => setHelpModal(true)}>Help</button>
                    </div>
                </div>
            </div>

                {newDeckModal && showModal && (
                    <Modal onClose={deckModalCloseHandler} >
                        <div className={styles.newDeckContainer}>
                        <h1>Create New Deck</h1>
                        <form onSubmit={newDeckSubmitHandler}>
                            <label>DeckName</label>
                            <input
                                type="text"
                                value={newDeckName}
                                onChange={(e) => setNewDeckName(e.target.value)} />
                            <button type="submit">Create Deck</button>
                        </form>
                    </div>
                    </Modal>
                )}

                {selected && showModal && (
                    <Modal onClose={() => setShowModal(false)}>
                        <div className={styles.cardContainer}>
                                <h1>Selected Card</h1>
                                <CardDisplay card={selected.card_type} />

                                {!selected.deck_id ?
                                (<div className={styles.selectedRemoveContainer}>
                                    <h3>Currently Unassigned</h3>
                                    <label>Add to deck:</label>
                                    <select
                                        value={selectedDropdown}
                                        onChange={(e) => setSelectedDropdown(Number(e.target.value))}
                                        >
                                        {decks.map(deck => <option key={deck.id} value={deck.id}>{deck.name}</option>)}
                                    </select>
                                    <h4>{amountInDeck(selected.card_type.id)} copies of this card in deck</h4>
                                    {collection[selectedDropdown].length < 20 && amountInDeck(selected.card_type.id) < 3 && <button onClick={addToDeck}>Add to deck</button>}
                                    {collection[selectedDropdown].length < 20 && amountInDeck(selected.card_type.id) === 3 && <h4>Cannot add more than 3 cards of the same type</h4>}
                                    {collection[selectedDropdown].length >= 20 && <h4>Deck is full!  Remove a cards in order to add more.</h4>}
                                </div>)
                                :
                                (<div className={styles.selectedRemoveContainer}>
                                    <h3>Currently in {deckName(selected.deck_id)}</h3>
                                    <h4>{amountInDeck(selected.card_type.id, selected.deck_id) === 1 ? `${amountInDeck(selected.card_type.id, selected.deck_id)} copy` : `${amountInDeck(selected.card_type.id, selected.deck_id)} copies`} of this card in deck</h4>
                                    <button onClick={removeFromDeck}>Remove from Deck</button>
                                </div>)}
                            </div>
                    </Modal>
                    )}

                {helpModal && (
                    <Modal onClose={() => setHelpModal(false)}>
                        <div className={styles.helpModal}>
                            <h2>Help</h2>
                            <p>To Add a card to your deck, click on the card and click 'add to deck'!</p>
                            <p>If a card is already in your deck, click on the card and click 'remove from deck'!</p>
                            <p>Remember -- Decks must have 20 cards.  Up to 3 copies of the same card can be placed in your deck.</p>
                        </div>
                    </Modal>
                )}

            <div className={styles.collectionWrapper}>
                {pageCards.map(card =>
                    <div key={card.id} onClick={() => selectHandler(card)}>
                        <CardDisplay card={card.card_type} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default CollectionDisplay;
