import React, {useEffect, useState} from 'react';
import HandDisplay from '../HandDisplay';

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

const shuffle = (array) => {
    //Fisher-Yates (aka Knuth) Shuffle
    //from http://sedition.com/perl/javascript-fy.html
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // Swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    }
    return array;
}

const GameBoard = ({socket}) => {
    const [hand, setHand] = useState([])
    const [deck, setDeck] = useState(shuffle(testDeck))
    
    useEffect(() => {
        let d = [...deck]
        let h = []
        for(let i = 0; i < 5; i++) {
            let card = d.pop()
            console.log(card)
            h.push(card)
        }
        setHand(h)
        setDeck(d)
    }, [])
    
    return (
        <div>
            <h1>Hello from the Game Board!</h1>
            <HandDisplay hand={hand} />
            {console.log(hand)}
        </div>
    )
}

export default GameBoard;