import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';

import styles from './GameBoard.module.css'
import HandDisplay from '../HandDisplay';
import CardDisplay from '../CardDisplay';
import BoardCardDisplay from './BoardCardDisplay'
import GamePlayerInfoContainer from '../GamePlayerInfoContainer';

// const testDeck = [
//     {name: "Unit Card 1",
//     type:'unit',
//     attack:100,
//     defense:300,
//     id:1},
//     {name: "Unit Card 2",
//     type:'unit',
//     attack:200,
//     defense:600,
//     id:2},
//     {name: "Unit Card 3",
//     type:'unit',
//     attack:300,
//     defense:800,
//     id:3},
//     {name: "Unit Card 4",
//     type:'unit',
//     attack:400,
//     defense:400,
//     id:4},
//     {name: "Unit Card 5",
//     type:'unit',
//     attack:500,
//     defense:300,
//     id:5},
//     {name: "Unit Card 6",
//     type:'unit',
//     attack:600,
//     defense:200,
//     id:6},
//     {name: "Unit Card 7",
//     type:'unit',
//     attack:700,
//     defense:500,
//     id:7},
//     {name: "Unit Card 8",
//     type:'unit',
//     attack:800,
//     defense:700,
//     id:8},
//     {name: "Unit Card 9",
//     type:'unit',
//     attack:900,
//     defense:500,
//     id:9},
//     {name: "Unit Card 10",
//     type:'unit',
//     attack:1000,
//     defense:400,
//     id:10},
//     {name:"Heal S",
//     type:'spell',
//     effect:'heal:200',
//     id:11},
//     {name:"Heal M",
//     type:'spell',
//     effect:'heal:500',
//     id:12},
//     {name:"Heal L",
//     type:'spell',
//     effect:'heal:800',
//     id:13},
//     {name:"Damage S",
//     type:'spell',
//     effect:'damage:200',
//     id:14},
//     {name:"Damage M",
//     type:'spell',
//     effect:'damage:500',
//     id:15},
//     {name:"Damage L",
//     type:'spell',
//     effect:'damage:800',
//     id:16},
// ]

// const shuffle = (array) => {
//     //Fisher-Yates (aka Knuth) Shuffle
//     //from http://sedition.com/perl/javascript-fy.html
//     var currentIndex = array.length, temporaryValue, randomIndex;
//     // While there remain elements to shuffle...
//     while (currentIndex !== 0) {
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;
//     // Swap it with the current element.
//     temporaryValue = array[currentIndex];
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temporaryValue;
//     }
//     return array;
// }

// const drawHand = (deck) => {
//     let h = []
//         for(let i = 0; i < 5; i++) {
//             let card = deck.pop()
//             h.push(card)
//         }
//     return h
// }

// let shuffledDeck = shuffle(testDeck);
// let initialHand = drawHand(shuffledDeck)



const shuffle = (arr) => {
    //Fisher-Yates (aka Knuth) Shuffle
    //from http://sedition.com/perl/javascript-fy.html
    let array = arr.map(c => c.card_type)
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
    console.log(h)
    return h
}

const GameBoard = ({socket, gameData, playerdeck}) => {
    console.log(gameData, 'game Data')
    const room_id = gameData.room_id;
    const turnOrder = gameData.turn_order;
    const user = useSelector(state => state.session.user)
    let shuffledDeck = shuffle(playerdeck);
    let initialHand = drawHand(shuffledDeck)

    // ---------- STATES ---------- \\
    const [turnNumber, setTurnNumber] = useState(1)
    const [hand, setHand] = useState(initialHand)
    const [deck, setDeck] = useState(shuffledDeck)

    const [playerHealth, setPlayerHealth] = useState(1000)
    const [opponentHealth, setOpponentHealth] = useState(1000)


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

    // ---------- HELPERS ---------- \\


    const handSelector = (int) => {
        setSelected(hand[int])
        if(placementPhase && hand[int].type === 'spell'){
            spellEffect(hand[int])
            removeFromHand(hand[int])
        }
    }

    const removeFromHand = (card) => {
        let h = [...hand]
        h.splice(h.findIndex(c => c.id === card.id), 1);
        setHand(h);
    }
    
    // ---------- USE EFFECTS ---------- \\
    useEffect(() => {

        if(turnOrder[0] === user.id){
            socket.emit('start_draw_phase', {
                user_id:user.id,
                room_id:room_id,
                turn_number:1
            })
        }

        // ---------- DRAW PHASE ---------- \\

        socket.on("draw_phase_start", data => {
            if(data.user_id === user.id) {
                if(deckCheck()){
                    setDrawPhase(true);
                }
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

        // ---------- PLACEMENT PHASE ---------- \\

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
                removeFromHand(data.card_type)
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

        socket.on("spell_used", data => {
            if(data.user_id === user.id){
                if(data.opp_health) {
                    setOpponentHealth(data.opp_health)
                }
                if(data.user_health) {
                    if(data.user_health <= 0) {
                        socket.emit('end_game', {
                            loser_id:user.id,
                            room_id:room_id,
                        })
                    }
                    setPlayerHealth(data.user_health)
                }
            }else {
                if(data.opp_health) {
                    setPlayerHealth(data.opp_health)
                }
                if(data.user_health) {
                    setOpponentHealth(data.user_health)
                }
            }
        })

        // ---------- COMBAT PHASE ---------- \\

        socket.on("combat_phase_start", data => {
            if (data.user_id === user.id){
                setPlacementPhase(false)
                setCombatPhase(true)
            }
        })

        socket.on('unit_attack', data => {
            console.log(data);
            if(data.user_id === user.id){
                if(Number(data.results) > 0){
                    if(data.target_health < 1){
                        let loserId;
                        if(turnOrder[0] === user.id){
                            loserId = turnOrder[1]
                        }else{
                            loserId = turnOrder[0]
                        }
                        socket.emit('end_game', {
                            loser_id:loserId,
                            room_id:room_id
                        })
                        return;
                    }
                    setOpponentHealth(data.target_health);
                    setPlayerHealth(data.user_health);
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
                    setPlayerHealth(data.target_health);
                    setOpponentHealth(data.user_health);
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

    // ---------- END TURN ---------- \\
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

    const deckCheck = () => {
        if(deck.length === 0){
            socket.emit("end_game", {
                loser_id:user.id,
                room_id:room_id
            })
        }
        return true;
    }

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

    const playerUnitSlotHandler = (int) => {
        if(placementPhase && selected && (selected.type === 'unit') && !unitPlaced){
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

    const spellEffect = (card) => {
        const effArr = card.effect.split(':')
        const effType = effArr[0]
        const effAmt = effArr[1]

        switch(effType) {
            case 'damage':
                const oh = opponentHealth - Number(effAmt);
                socket.emit('use_spell', {
                    room_id: room_id,
                    user_id: user.id,
                    hand_size: hand.length,
                    effect:'damage',
                    opp_health:oh
                })
                break;
            case 'heal':
                const ph = playerHealth + Number(effAmt)
                socket.emit('use_spell', {
                    room_id: room_id,
                    user_id: user.id,
                    effect:'heal',
                    user_health:ph
                })
                break;
        }
    }

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

    const opponentUnitSlotHandler = (int) => {
        if(opponentUnitSlot1 || opponentUnitSlot2 || opponentUnitSlot3){
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
                let userHealth = playerHealth
                let targetHealth = opponentHealth
                if(results > 0){
                    targetHealth -= results;
                }else{
                    userHealth -= results;
                }
    
                socket.emit('attack', {
                    room_id:room_id,
                    user_id:user.id,
                    attacker_slot:selUnitSlot,
                    defender_slot:int,
                    results:results,
                    user_health:userHealth,
                    target_health:targetHealth,
                })
            }
        }else{
            if(combatPhase && selectedUnit && !hasAttacked.includes(int)){
                hasAttacked.push(int)
                let userHealth = playerHealth
                let targetHealth = opponentHealth

                targetHealth -= selectedUnit.attack

                socket.emit('attack', {
                    room_id:room_id,
                    user_id:user.id,
                    attacker_slot:selUnitSlot,
                    defender_slot:int,
                    results:selectedUnit.attack,
                    user_health:userHealth,
                    target_health:targetHealth,
                })
            }
        }        
    }


    const endTurnHandler = () => {
        socket.emit('end_turn', {
            room_id: room_id,
            user_id: user.id,
            turn_number: turnNumber
        })
    }

    // ---------- JSX ---------- \\

    return (
        <div className={styles.boardWrapper}>
            {/* <GamePlayerInfoContainer 
                playerName={gameData.opponent_name}
                handSize={opponentHand}
                deckSize={opponentDeck}
                health={opponentHealth} /> */}

            {/* <GamePlayerInfoContainer 
                playerName={user.username}
                handSize={hand.length}
                deckSize={deck.length}
                health={playerHealth} /> */}


            {selected && <p> Selected Hand = {selected.name} </p>}
            {selectedUnit && <p> Selected Unit = {selectedUnit.name} </p>}


            <div className={styles.opponentUnitBoard}>
                <div className={styles.opponentUnit} onClick={() => opponentUnitSlotHandler(1)}>
                    {opponentUnitSlot1 && <BoardCardDisplay card={opponentUnitSlot1} />}
                </div>
                <div className={styles.opponentUnit} onClick={() => opponentUnitSlotHandler(2)}>
                    {opponentUnitSlot2 && <BoardCardDisplay card={opponentUnitSlot2} />}
                </div>
                <div className={styles.opponentUnit} onClick={() => opponentUnitSlotHandler(3)}>
                    {opponentUnitSlot3 && <BoardCardDisplay card={opponentUnitSlot3} />}
                </div>

                <GamePlayerInfoContainer 
                playerName={gameData.opponent_name}
                handSize={opponentHand}
                deckSize={opponentDeck}
                health={opponentHealth} />
            </div>


            <div className={styles.playerUnitBoard}>
                <div className={styles.playerUnit} onClick={() => playerUnitSlotHandler(1)}>
                    {playerUnitSlot1 && <BoardCardDisplay card={playerUnitSlot1} />}
                </div>
                <div className={styles.playerUnit} onClick={() => playerUnitSlotHandler(2)}>
                    {playerUnitSlot2 && <BoardCardDisplay card={playerUnitSlot2} />}
                </div>
                <div className={styles.playerUnit} onClick={() => playerUnitSlotHandler(3)}>
                    {playerUnitSlot3 && <BoardCardDisplay card={playerUnitSlot3} />}
                </div>

                <GamePlayerInfoContainer 
                playerName={user.username}
                handSize={hand.length}
                deckSize={deck.length}
                health={playerHealth} />
            </div>

            <div className={styles.handWrapper}>
            {hand && hand.map((card, i) => (
                <div onClick={() => handSelector(i)}>
                    <CardDisplay card={card} />
                </div>
                )) }
            </div>

            {drawPhase && (
                <button className={styles.actionButton} onClick={drawButtonHandler}>Draw Card!!</button>
            )}

            {placementPhase && (
                <button className={styles.actionButton} onClick={beginCombatPhase}>Start Combat Phase!</button>
            )}
            {combatPhase && (
                <button className={styles.actionButton} onClick={endTurnHandler}>End Turn</button>
            )}
        </div>
    )
}

export default GameBoard;