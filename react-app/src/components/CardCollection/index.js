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
            const allCards = await getUserCards(user.id);
            if(allCards) setCards(allCards.cards);
            setLoading(false);
        })()
    })

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