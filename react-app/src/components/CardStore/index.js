import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { getCards } from '../../services/card_store'
import CardStore from './CardStore'


const CardStoreWrapper = () => {
    const user = useSelector(state => state.session.user);
    const [ loading, setLoading ] = useState(true);
    const [ organized, setOrganized ] = useState(null);

    useEffect(() => {
        (async () => {
            let organizedObj = {
                r0:[],
                r1:[],
                r2:[],
                r3:[],
                r4:[],
            }
            const allCards = await getCards()
            allCards.cards.forEach(card => {
            let rarity = `r${card.rarity}`
            organizedObj[rarity].push(card)
            })
            console.log(organizedObj)
            setOrganized(organizedObj);
            setLoading(false);
        })()
    }, [])

    return (
        <div>
            <h1>Welcome, {user.username}</h1>
            {loading && !organized && (
                <h1>loading card store...</h1>
            )}
            {!loading && organized && (
                <CardStore cards={organized} />
            )}
        </div>
    )
}

export default CardStoreWrapper;