import React, { useState, useEffect } from 'react';
import CardDisplay from '../CardDisplay';


const HandDisplay = ({ hand }) => {
    return (
        <div>
            {hand && hand.map(card => (
                <CardDisplay card={card} />
            )) }
        </div>
    )
}

export default HandDisplay;