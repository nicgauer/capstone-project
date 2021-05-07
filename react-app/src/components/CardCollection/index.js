import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { getUserCards } from '../../services/card_collection'
import CollectionDisplay from './CollectionDisplay';


const CardCollection = () => {
    const user = useSelector(state => state.session.user);
    const [ loading, setLoading ] = useState(true);
    const [ cards, setCards ] = useState(null);

    useEffect(() => {
        (async () => {
            let organizedCards = {
                box:[]
            }
            const allCards = await getUserCards(user.id);
            organizedCards.allCards = allCards.cards;
            allCards.cards.forEach(card => {
                if(card.deck_id){
                    if(organizedCards[card.deck_id]) {
                        organizedCards[card.deck_id].push(card);
                    }else {
                        organizedCards[card.deck_id] = [card];
                    }
                }else {
                    organizedCards.box.push(card)
                }
            })
            setCards(organizedCards);
            setLoading(false);
        })()
    }, [])

    return (
        <div>
            <h1>{user.username}'s Cards</h1>
            {loading && (<h3>loading...</h3>)}
            {!loading && cards && (
                <CollectionDisplay cards={cards} />
            )}
        </div>
    )
}

export default CardCollection;