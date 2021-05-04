import React, {useEffect, useState} from 'react';


const CardDisplay = ({card}) => {

    return (
        <div>
            <div>
                <h3>{card.name}</h3>
            </div>
        </div>
    )
}

export default CardDisplay