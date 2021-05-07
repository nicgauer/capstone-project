import React, {useState, useEffect} from 'react';
import CardDisplay from '../CardDisplay';
import styles from './CollectionDisplay.module.css';
import { addCardToDeck } from '../../services/deck';

const CollectionDisplay = ({cards}) => {
    const decks = Object.keys(cards).filter(key => (key !== 'allCards') && (key !== 'box'))
    const [displaying, setDisplaying] = useState(cards.allCards);
    const [dropdown, setDropdown] = useState('allCards')
    const [selectedDropdown, setSelectedDropdown] = useState(decks[0])
    const [selected, setSelected] = useState(null);

    const displaySelectHandler = (e) => {
        setDropdown(e.target.value);
        setDisplaying(cards[e.target.value]);
        setSelected(null);
    }

    const selectHandler = (card) => {
        setSelected(card)
    }

    const addToDeck = () => {
        addCardToDeck(selected.id, selectedDropdown)

        let b = [...cards.box]
        b.splice(b.findIndex(c => c.id == selected.id), 1);
        cards.box = b;
        cards[selectedDropdown].push(selected);
        setSelected(null);
        setDisplaying(cards.box);
    }

    return (
        <div className={styles.container}>
            <div>
                <select
                    value={dropdown}
                    onChange={displaySelectHandler}>
                    {Object.keys(cards).map(key => <option key={key} value={key}>{key}</option>)}
                </select>
                {selected && (<div>
                        <h1>Selected Card</h1>
                        <CardDisplay card={selected.card_type} />
                        {((dropdown === 'allCards') || (dropdown === 'box')) && 
                        <div>
                            <select 
                                value={selectedDropdown}
                                onChange={(e) => setSelectedDropdown(e.target.value)}
                                >
                                {decks.map(key => <option key={key} value={key}>{key}</option>)}
                            </select>
                            <button onClick={addToDeck}>Add to deck</button>
                        </div>}
                    </div>)}
            </div>
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