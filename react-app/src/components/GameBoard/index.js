import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';

import styles from './GameBoard.module.css'
import HandDisplay from '../HandDisplay';
import CardDisplay from '../CardDisplay';

const testDeck = [
    {name: "card 1",
    id:1},
    {name: "card 2",
    id:2},
    {name: "card 3",
    id:3},
    {name: "card 4",
    id:4},
    {name: "card 5",
    id:5},
    {name: "card 6",
    id:6},
    {name: "card 7",
    id:7},
    {name: "card 8",
    id:8},
    {name: "card 9",
    id:9},
    {name: "card 10",
    id:10},
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
    const [placementPhase, setPlacementPhase] = useState(false)

    const [opponentHand, setOpponentHand] = useState(5)
    const [opponentDeck, setOpponentDeck] = useState(5)

    const [selected, setSelected] = useState(null)

    const [playerUnitSlot1, setPlayerUnitSlot1] = useState(null)
    const [playerUnitSlot2, setPlayerUnitSlot2] = useState(null)
    const [playerUnitSlot3, setPlayerUnitSlot3] = useState(null)

    const [opponentUnitSlot1, setOpponentUnitSlot1] = useState(null)
    const [opponentUnitSlot2, setOpponentUnitSlot2] = useState(null)
    const [opponentUnitSlot3, setOpponentUnitSlot3] = useState(null)
    
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

    const handSelector = (int) => {
        setSelected(hand[int])
    }

    // ---------- DRAW PHASE ---------- \\

    socket.on("draw_phase_start", data => {
        if(data.user_id === user.id) {
            setDrawPhase(true);
        }
    })

    socket.on("card_drawn", data => {
        if(data.user_id === user.id) {
            drawCard();
            setDrawPhase(false);
            socket.emit("start_placement_phase", {
                user_id: user.id,
                room_id: room_id,
            })
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

    // ---------- PLACEMENT PHASE ---------- \\
    
    socket.on("placement_phase_start", data => {
        if(data.user_id === user.id) {
            setPlacementPhase(true);
        }
    })

    const unitSlotHandler = () => {
        if(placementPhase && selected){

        }
    }


    return (
        <div>
            <h1>Hello from the Game Board!</h1>
            <h4>Playing against {gameData.opponent_name}</h4>
            <p>{gameData.opponent_name} hand size - {opponentHand}</p>
            <p>{gameData.opponent_name} deck size - {opponentDeck}</p>
            {selected && <p> Selected card = {selected.name} </p>}

            <div className={styles.opponentUnitBoard}>
                <div className={styles.opponentUnit}>
                    {opponentUnitSlot1 && <CardDisplay card={opponentUnitSlot1} />}
                </div>
                <div className={styles.opponentUnit}>
                    {opponentUnitSlot2 && <CardDisplay card={opponentUnitSlot2} />}
                </div>
                <div className={styles.opponentUnit}>
                    {opponentUnitSlot3 && <CardDisplay card={opponentUnitSlot3} />}
                </div>
            </div>


            <div className={styles.playerUnitBoard}>
                <div className={styles.playerUnit}>
                    {playerUnitSlot1 && <CardDisplay card={playerUnitSlot1} />}
                </div>
                <div className={styles.playerUnit}>
                    {playerUnitSlot2 && <CardDisplay card={playerUnitSlot2} />}
                </div>
                <div className={styles.playerUnit}>
                    {playerUnitSlot3 && <CardDisplay card={playerUnitSlot3} />}
                </div>
            </div>

            <div className={styles.handWrapper}>
            {hand && hand.map((card, i) => (
                <div onClick={() => handSelector(i)}>
                    <CardDisplay card={card} />
                </div>
                )) }
            </div>

            {drawPhase && (
                <button onClick={drawButtonHandler}>Draw Card!!</button>
            )}
        </div>
    )
}

export default GameBoard;