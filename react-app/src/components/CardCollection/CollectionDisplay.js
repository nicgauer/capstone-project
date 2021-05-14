import React, {useState, useEffect} from 'react';
import CardDisplay from '../CardDisplay';
import styles from './CollectionDisplay.module.css';
import { addCardToDeck, removeCardFromDeck, newDeck } from '../../services/deck';
import { Modal } from '../../context/Modal';
import Navigation from '../Navigation';
import { useSelector } from 'react-redux';


const CollectionDisplay = ({cards}) => {
    const user = useSelector(state => state.session.user);
    const [decks, setDecks] = useState([...cards.decks])
    const [displaying, setDisplaying] = useState(cards.allCards);
    const [dropdown, setDropdown] = useState('allCards')
    const [selectedDropdown, setSelectedDropdown] = useState(decks[0].id)
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newDeckModal, setNewDeckModal] = useState(false);
    const [newDeckName, setNewDeckName] = useState('New Deck');

    const displaySelectHandler = (e) => {
        setDropdown(e.target.value);
        setDisplaying(cards[e.target.value]);
        setSelected(null);
    }

    const selectHandler = (card) => {
        setSelected(card)
        setShowModal(true)
    }

    const addToDeck = () => {
        addCardToDeck(selected.id, selectedDropdown)

        let b = [...cards.box]
        b.splice(b.findIndex(c => c.id == selected.id), 1);
        cards.box = b;
        selected.deck_id = selectedDropdown;
        cards[selectedDropdown].push(selected);
        setSelected(null);
        setShowModal(false)
        setDisplaying(cards.box);
    }

    const removeFromDeck = () => {
        removeCardFromDeck(selected.id)

        let d = [...cards[selectedDropdown]]
        d.splice(d.findIndex(c => c.id === selected.id), 1);
        cards[selectedDropdown] = d
        selected.deck_id = null;
        cards.box.push(selected);
        setSelected(null);
        setShowModal(false)
        setDisplaying(cards[selectedDropdown]);
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
        
        const nd = await newDeck(user.id, newDeckName)
        let newDecks = [...decks, nd]
        cards[nd.id] = [];
        setDecks(newDecks);
        setShowModal(false) 
        setNewDeckModal(false)
        setDisplaying(cards[nd.id])
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
                    </div>
                    <div className={styles.centerSpacer}>
                        <h5 className={styles.displaying}>{displayParser(displaying)}</h5>
                        <h5>{displaying.length} cards</h5>
                    </div>
                    <div className={styles.rightSpacer}>
                        <button className={styles.newDeckButton} onClick={newDeckButtonHandler}>Create New Deck</button>
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
                                (<div>
                                    <select 
                                        value={selectedDropdown}
                                        onChange={(e) => setSelectedDropdown(e.target.value)}
                                        >
                                        {decks.map(deck => <option key={deck.id} value={deck.id}>{deck.name}</option>)}
                                    </select>
                                    <button onClick={addToDeck}>Add to deck</button>
                                </div>)
                                :
                                (<div className={styles.selectedRemoveContainer}>
                                    <h3>Currently in {deckName(selected.deck_id)}</h3>
                                    <button onClick={removeFromDeck}>Remove from Deck</button>
                                </div>)}
                            </div>
                    </Modal>
                    )}

            <div className={styles.collectionWrapper}>
                {displaying.map(card => 
                    <div onClick={() => selectHandler(card)}>
                        <CardDisplay card={card.card_type} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default CollectionDisplay;