import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { getCards } from '../../services/card_store'

const CardStore = ({cards}) => {
    const user = useSelector(state => state.session.user);

    return (

    )
}

export default CardStore;