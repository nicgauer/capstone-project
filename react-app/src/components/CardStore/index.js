import React, {useEffect, useState} from 'react';
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { getCards } from '../../services/card_store';
import CardStore from './CardStore';
import Navigation from '../Navigation';


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
            setOrganized(organizedObj);
            setLoading(false);
        })()
    }, [])

    return (
        <div>
            <Navigation currentLocation={'store'} />
            <h1 style={{'text-align':'center'}}>Welcome, {user.username}</h1>
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