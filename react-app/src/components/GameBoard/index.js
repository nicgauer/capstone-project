import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
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

const GameBoard = ({socket, gameData}) => {
    const room_id = gameData.room_id;
    const turnOrder = gameData.turn_order;
    const user = useSelector(state => state.session.user)
    const [hand, setHand] = useState([])
    const [deck, setDeck] = useState(shuffle(testDeck))

    const [drawPhase, setDrawPhase] = useState(false)

    const [opponentHand, setOpponentHand] = useState(5)
    const [opponentDeck, setOpponentDeck] = useState(5)
    
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
        if(turnOrder[0] === user.id){
            socket.emit('start_draw_phase', {
                user_id: user.id,
                room_id: room_id
            })
        }
    }, [])

    socket.on("draw_phase_start", data => {
        if(data.user_id === user.id) {
            setDrawPhase(true);
        }
    })

    socket.on("card_drawn", data => {
        if(data.user_id === user.id) {
            drawCard();
        }else {
            setOpponentHand(data.hand_size);
            setOpponentDeck(data.deck_size);
        }
    })

    const drawButtonHandler = () => {
        socket.emit('draw_card', {
            room_id:room_id,
            user_id: user.id,
            hand_size: (hand.length + 1),
            deck_size: (deck.length - 1),
        })
    }

    const drawCard = () => {
        let d = [...deck]
        let h = [...hand]
        let card = d.pop()
        h.push(card)
        setHand(h)
        setDeck(d)
    }
    
    return (
        <div>
            <h1>Hello from the Game Board!</h1>
            <h4>Playing against {gameData.opponent_name}</h4>
            <p>{gameData.opponent_name} hand size - {opponentHand}</p>
            <p>{gameData.opponent_name} deck size - {opponentDeck}</p>
            <HandDisplay hand={hand} />
            {drawPhase && (
                <button onClick={drawButtonHandler}>Draw Card!!</button>
            )}
        </div>
    )
}

export default GameBoard;