import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';

import styles from './GameBoard.module.css'
import HandDisplay from '../HandDisplay';
import CardDisplay from '../CardDisplay';

const testDeck = [
    {name: "card 1",
    attack:100,
    defense:300,
    id:1},
    {name: "card 2",
    attack:200,
    defense:600,
    id:2},
    {name: "card 3",
    attack:300,
    defense:800,
    id:3},
    {name: "card 4",
    attack:400,
    defense:400,
    id:4},
    {name: "card 5",
    attack:500,
    defense:300,
    id:5},
    {name: "card 6",
    attack:600,
    defense:200,
    id:6},
    {name: "card 7",
    attack:700,
    defense:500,
    id:7},
    {name: "card 8",
    attack:800,
    defense:700,
    id:8},
    {name: "card 9",
    attack:900,
    defense:500,
    id:9},
    {name: "card 10",
    attack:1000,
    defense:400,
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

const drawHand = (deck) => {
    let h = []
        for(let i = 0; i < 5; i++) {
            let card = deck.pop()
            h.push(card)
        }
    return h
}

let shuffledDeck = shuffle(testDeck);
let initialHand = drawHand(shuffledDeck)


const GameBoard = ({socket, gameData}) => {
    const room_id = gameData.room_id;
    const turnOrder = gameData.turn_order;
    const user = useSelector(state => state.session.user)

    // ---------- STATES ---------- \\
    const [turnNumber, setTurnNumber] = useState(1)
    const [hand, setHand] = useState(initialHand)
    const [deck, setDeck] = useState(shuffledDeck)

    const [playerHealth, setPlayerHealth] = useState(2000)
    const [opponentHealth, setOpponentHealth] = useState(2000)


    const [drawPhase, setDrawPhase] = useState(false)
    const [placementPhase, setPlacementPhase] = useState(false)
    const [combatPhase, setCombatPhase] = useState(false)

    const [opponentHand, setOpponentHand] = useState(5)
    const [opponentDeck, setOpponentDeck] = useState(5)

    const [selected, setSelected] = useState(null)
    const [unitPlaced, setUnitPlaced] = useState(false)
    const [trapPlaced, setTrapPlaced] = useState(false)

    const [selectedUnit, setSelectedUnit] = useState(null)
    let selUnitSlot = null;

    let hasAttacked = [];
    const [playerUnitSlot1, setPlayerUnitSlot1] = useState(null)
    const [playerUnitSlot2, setPlayerUnitSlot2] = useState(null)
    const [playerUnitSlot3, setPlayerUnitSlot3] = useState(null)

    const [opponentUnitSlot1, setOpponentUnitSlot1] = useState(null)
    const [opponentUnitSlot2, setOpponentUnitSlot2] = useState(null)
    const [opponentUnitSlot3, setOpponentUnitSlot3] = useState(null)

    // ---------- USE EFFECTS ---------- \\

    const handSelector = (int) => {
        setSelected(hand[int])
    }

    useEffect(() => {

        if(turnOrder[0] === user.id){
            socket.emit('start_draw_phase', {
                user_id:user.id,
                room_id:room_id,
                turn_number:1
            })
        }

        socket.on("draw_phase_start", data => {
            if(data.user_id === user.id) {
                setDrawPhase(true);
            }
            setTurnNumber(data.turn_number);
        })

        socket.on("card_drawn", data => {
            if(data.user_id === user.id) {
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

        socket.on("placement_phase_start", data => {
            if(data.user_id === user.id) {
                setPlacementPhase(true);
            }
        })

        socket.on("unit_placed", data => {
            if(data.user_id === user.id) {
                if(data.unit_slot == 1){
                    setPlayerUnitSlot1(data.card_type)
                }
                if(data.unit_slot == 2){
                    setPlayerUnitSlot2(data.card_type)
                }
                if(data.unit_slot == 3){
                    setPlayerUnitSlot3(data.card_type)
                }
    
                //Remove played card from hand
                const h = hand.filter(( card ) => {
                    return card.id !== data.card_type.id;
                });
                setHand(h);
            }else{
                if(data.unit_slot == 1){
                    setOpponentUnitSlot1(data.card_type)
                }
                if(data.unit_slot == 2){
                    setOpponentUnitSlot2(data.card_type)
                }
                if(data.unit_slot == 3){
                    setOpponentUnitSlot3(data.card_type)
                }
                setOpponentHand(data.hand_size)
            }
        })

        socket.on("combat_phase_start", data => {
            if (data.user_id === user.id){
                setPlacementPhase(false)
                setCombatPhase(true)
            }
        })

        socket.on('unit_attack', data => {
            if(data.user_id === user.id){
                if(Number(data.results) > 0){
                    let oh = opponentHealth;
                    setOpponentHealth(oh - data.results)
                    if(data.defender_slot === 1){
                        setOpponentUnitSlot1(null);
                    }
                    if(data.defender_slot === 2){
                        setOpponentUnitSlot2(null);
                    }
                    if(data.defender_slot === 3){
                        setOpponentUnitSlot3(null);
                    }
                }
            }else {
                if(Number(data.results) > 0){
                    let ph = playerHealth;
                    setPlayerHealth(ph - data.results)
                    if(data.defender_slot === 1){
                        setPlayerUnitSlot1(null);
                    }
                    if(data.defender_slot === 2){
                        setPlayerUnitSlot2(null);
                    }
                    if(data.defender_slot === 3){
                        setPlayerUnitSlot3(null);
                    }
            }
        }
    })
    
        socket.on('turn_ended', data => {
            if (data.user_id === user.id){
                setCombatPhase(false)
                setUnitPlaced(false)
                setTrapPlaced(false)
                setSelectedUnit(null)
                selUnitSlot = null;
                hasAttacked = [];
                setSelected(null)
                let userId;
                if(turnOrder[0] === user.id){
                    userId = turnOrder[1]
                }else{
                    userId = turnOrder[0]
                }
                socket.emit("start_draw_phase", {
                    room_id:room_id,
                    user_id: userId,
                    turn_number: turnNumber + 1
                })
            }
        })

    }, [])

    // ---------- DRAW PHASE ---------- \\

    // socket.on("draw_phase_start", data => {
    //     if(data.user_id === user.id) {
    //         setDrawPhase(true);
    //     }
    //     setTurnNumber(data.turn_number);
    // })

    // socket.on("card_drawn", data => {
    //     if(data.user_id === user.id) {
    //         drawCard();
    //         setDrawPhase(false);
    //         socket.emit("start_placement_phase", {
    //             user_id: user.id,
    //             room_id: room_id,
    //         })
    //     }else {
    //         setOpponentHand(data.hand_size);
    //         setOpponentDeck(data.deck_size);
    //     }
    // })

    const drawButtonHandler = () => {
        drawCard()
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
    
    // socket.on("placement_phase_start", data => {
    //     if(data.user_id === user.id) {
    //         setPlacementPhase(true);
    //     }
    // })

    const playerUnitSlotHandler = (int) => {
        if(placementPhase && selected && !unitPlaced){
            if(int === 1 && playerUnitSlot1) return;
            if(int === 2 && playerUnitSlot2) return;
            if(int === 3 && playerUnitSlot3) return;
            socket.emit('place_unit', {
                room_id:room_id,
                user_id: user.id,
                hand_size: (hand.length - 1),
                card_type: selected,
                unit_slot: int
            })
            setSelected(null);
        }

        if(combatPhase){
            if(int === 1 && playerUnitSlot1) {
                setSelectedUnit(playerUnitSlot1);
                selUnitSlot = int
            }
            if(int === 2 && playerUnitSlot2) {
                setSelectedUnit(playerUnitSlot2);
                selUnitSlot = int
            }
            if(int === 3 && playerUnitSlot3) {
                setSelectedUnit(playerUnitSlot3);
                selUnitSlot = int
            }
        }
    }

    // socket.on("unit_placed", data => {
    //     if(data.user_id === user.id) {
    //         if(data.unit_slot == 1){
    //             setPlayerUnitSlot1(data.card_type)
    //         }
    //         if(data.unit_slot == 2){
    //             setPlayerUnitSlot2(data.card_type)
    //         }
    //         if(data.unit_slot == 3){
    //             setPlayerUnitSlot3(data.card_type)
    //         }

    //         //Remove played card from hand
    //         const h = hand.filter(( card ) => {
    //             return card.id !== data.card_type.id;
    //         });
    //         setHand(h);
    //     }else{
    //         if(data.unit_slot == 1){
    //             setOpponentUnitSlot1(data.card_type)
    //         }
    //         if(data.unit_slot == 2){
    //             setOpponentUnitSlot2(data.card_type)
    //         }
    //         if(data.unit_slot == 3){
    //             setOpponentUnitSlot3(data.card_type)
    //         }
    //         setOpponentHand(data.hand_size)
    //     }
    // })

    // ---------- COMBAT PHASE ---------- \\

    const beginCombatPhase = () => {
        if(turnNumber === 1){
            setPlacementPhase(false)
            socket.emit('end_turn', {
                room_id: room_id,
                user_id: user.id,
                turn_number: turnNumber
            })
        }else {
            socket.emit('start_combat_phase', {
                room_id:room_id,
                user_id: user.id,
            })
        }
    }

    // socket.on("combat_phase_start", data => {
    //     if (data.user_id === user.id){
    //         setPlacementPhase(false)
    //         setCombatPhase(true)
    //     }
    // })

    const opponentUnitSlotHandler = (int) => {
        if(int === 1 && !opponentUnitSlot1) return;
        if(int === 2 && !opponentUnitSlot2) return;
        if(int === 3 && !opponentUnitSlot3) return;
        if(combatPhase && selectedUnit && !hasAttacked.includes(int)){
            hasAttacked.push(int)
            let results
            if(int === 1){
                results = selectedUnit.attack - opponentUnitSlot1.defense
            }
            if(int === 2){
                results = selectedUnit.attack - opponentUnitSlot2.defense
            }
            if(int === 3){
                results = selectedUnit.attack - opponentUnitSlot3.defense
            }

            socket.emit('attack', {
                room_id:room_id,
                user_id:user.id,
                attacker_slot:selUnitSlot,
                defender_slot:int,
                results:results
            })
        }
    }

//     socket.on('unit_attack', data => {
//         if(data.user_id === user.id){
//             if(Number(data.results) > 0){
//                 let oh = opponentHealth;
//                 setOpponentHealth(oh - data.results)
//                 if(data.defender_slot === 1){
//                     setOpponentUnitSlot1(null);
//                 }
//                 if(data.defender_slot === 2){
//                     setOpponentUnitSlot2(null);
//                 }
//                 if(data.defender_slot === 3){
//                     setOpponentUnitSlot3(null);
//                 }
//             }
//         }else {
//             if(Number(data.results) > 0){
//                 let ph = playerHealth;
//                 setPlayerHealth(ph - data.results)
//                 if(data.defender_slot === 1){
//                     setPlayerUnitSlot1(null);
//                 }
//                 if(data.defender_slot === 2){
//                     setPlayerUnitSlot2(null);
//                 }
//                 if(data.defender_slot === 3){
//                     setPlayerUnitSlot3(null);
//                 }
//         }
//     }
// })

//     socket.on('turn_ended', data => {
//         if (data.user_id === user.id){
//             setCombatPhase(false)
//             setUnitPlaced(false)
//             setTrapPlaced(false)
//             setSelectedUnit(null)
//             selUnitSlot = null;
//             hasAttacked = [];
//             setSelected(null)
//             let userId;
//             if(turnOrder[0] === user.id){
//                 userId = turnOrder[1]
//             }else{
//                 userId = turnOrder[0]
//             }
//             socket.emit("start_draw_phase", {
//                 room_id:room_id,
//                 user_id: userId,
//                 turn_number: turnNumber + 1
//             })
//         }
//     })

    const endTurnHandler = () => {
        socket.emit('end_turn', {
            room_id: room_id,
            user_id: user.id,
            turn_number: turnNumber
        })
    }

    // ---------- JSX ---------- \\

    return (
        <div>
            <h1>Hello from the Game Board!</h1>
            <h4>Playing against {gameData.opponent_name}</h4>
            <p>{gameData.opponent_name} hand size - {opponentHand}</p>
            <p>{gameData.opponent_name} deck size - {opponentDeck}</p>
            <p>{gameData.opponent_name} health points - {opponentHealth}</p>
            <p>Your health points - {playerHealth}</p>
            {selected && <p> Selected Hand = {selected.name} </p>}
            {selectedUnit && <p> Selected Unit = {selectedUnit.name} </p>}

            <div className={styles.opponentUnitBoard}>
                <div className={styles.opponentUnit} onClick={() => opponentUnitSlotHandler(1)}>
                    {opponentUnitSlot1 && <CardDisplay card={opponentUnitSlot1} />}
                </div>
                <div className={styles.opponentUnit} onClick={() => opponentUnitSlotHandler(2)}>
                    {opponentUnitSlot2 && <CardDisplay card={opponentUnitSlot2} />}
                </div>
                <div className={styles.opponentUnit} onClick={() => opponentUnitSlotHandler(3)}>
                    {opponentUnitSlot3 && <CardDisplay card={opponentUnitSlot3} />}
                </div>
            </div>


            <div className={styles.playerUnitBoard}>
                <div className={styles.playerUnit} onClick={() => playerUnitSlotHandler(1)}>
                    {playerUnitSlot1 && <CardDisplay card={playerUnitSlot1} />}
                </div>
                <div className={styles.playerUnit} onClick={() => playerUnitSlotHandler(2)}>
                    {playerUnitSlot2 && <CardDisplay card={playerUnitSlot2} />}
                </div>
                <div className={styles.playerUnit} onClick={() => playerUnitSlotHandler(3)}>
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

            {placementPhase && (
                <button onClick={beginCombatPhase}>Start Combat Phase!</button>
            )}
            {combatPhase && (
                <button onClick={endTurnHandler}>End Turn</button>
            )}
        </div>
    )
}

export default GameBoard;