import React, {useEffect, useState} from 'react';

const GameBoard = ({socket}) => {
    const testDeck = [
        {name: "card 1"},
        {name: "card 2"},
        {name: "card 3"},
        {name: "card 4"},
        {name: "card 5"},
        {name: "card 6"},
        {name: "card 7"},
        {name: "card 8"},
        {name: "card 9"},
        {name: "card 10"},
    ]
    
    return (
        <div>
            <h1>Hello from the Game Board!</h1>
        </div>
    )
}

export default GameBoard;