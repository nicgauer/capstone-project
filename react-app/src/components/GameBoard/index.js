import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';

import styles from './GameBoard.module.css'
import HandDisplay from '../HandDisplay';
import CardDisplay from '../CardDisplay';
import BoardCardDisplay from './BoardCardDisplay'
import GamePlayerInfoContainer from '../GamePlayerInfoContainer';
import GameChat from './chat';
import { Modal } from '../../context/Modal';
import RulesPage from '../MatchmakingLobby/rules';

import explosion from '../../assets/explosion.gif';


const shuffle = (array) => {
    console.log(array, "SHUFFLE");
    //Fisher-Yates (aka Knuth) Shuffle
    //from http://sedition.com/perl/javascript-fy.html
    // let array = arr.map(c => c.card_type)
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
    console.log(deck)
    return h
}

const GameBoard = ({socket, gameData, playerdeck}) => {
    const room_id = gameData.room_id;
    const turnOrder = gameData.turn_order;
    const user = useSelector(state => state.session.user)

    // ---------- STATES ---------- \\
    const [turnNumber, setTurnNumber] = useState(1)
    const [hand, setHand] = useState([])
    const [deck, setDeck] = useState(playerdeck)

    //Health point display and counter
    const [playerHealth, setPlayerHealth] = useState(2000)
    const [opponentHealth, setOpponentHealth] = useState(2000)

    //Phase controllers for action unlock
    const [drawPhase, setDrawPhase] = useState(false)
    const [placementPhase, setPlacementPhase] = useState(false)
    const [combatPhase, setCombatPhase] = useState(false)

    //Not actual data stores -- just ints for amount displays
    const [opponentHand, setOpponentHand] = useState(5)
    const [opponentDeck, setOpponentDeck] = useState(5)

    //Selected contains card instance object
    const [selected, setSelected] = useState(null)

    //Unit placed prevents multiple units being placed in a turn
    const [unitPlaced, setUnitPlaced] = useState(false)
    const [trapPlaced, setTrapPlaced] = useState(false)

    const [selectedUnit, setSelectedUnit] = useState(null)
    const [ selUnitSlot, setSelUnitSlot ] = useState(null)

    //Has Attacked state contains array of unit slots that have attacked this turn
    const [hasAttacked, setHasAttacked] = useState([])
    const [playerUnitSlot1, setPlayerUnitSlot1] = useState(null)
    const [explosionEffect1, setExplosionEffect1] = useState(false)
    const [playerUnitSlot2, setPlayerUnitSlot2] = useState(null)
    const [explosionEffect2, setExplosionEffect2] = useState(false)
    const [playerUnitSlot3, setPlayerUnitSlot3] = useState(null)
    const [explosionEffect3, setExplosionEffect3] = useState(false)

    const [opponentUnitSlot1, setOpponentUnitSlot1] = useState(null)
    const [explosionEffect4, setExplosionEffect4] = useState(false)
    const [opponentUnitSlot2, setOpponentUnitSlot2] = useState(null)
    const [explosionEffect5, setExplosionEffect5] = useState(false)
    const [opponentUnitSlot3, setOpponentUnitSlot3] = useState(null)
    const [explosionEffect6, setExplosionEffect6] = useState(false)

    //Log controls
    const [log, setLog] = useState(["Game Started!"]);
    const [logToggle, setLogToggle] = useState(false);

    const [helpModal, setHelpModal] = useState(false);

    // ---------- HELPERS ---------- \\

    //Handles clicking on cards in hand
    const handSelector = (int) => {
        //Checks to see if card selected is a spell card and is playable, if so plays it
        if(placementPhase && hand[int].card_type.type === 'spell'){
            if(hand[int].card_type.effect.split(':')[0] === 'draw'){
                spellEffect(hand[int].card_type)
                drawCardSpell(hand[int].card_type.effect.split(':')[1], hand[int].id)
            }else {
                spellEffect(hand[int].card_type)
                removeFromHand(hand[int])
            }
        }else{
            setSelected(hand[int])
        }
    }

    //Removes cards from hand by using card instance id
    const removeFromHand = (card) => {
        let h = [...hand]
        setHand(h.filter(c => c.id != card.id));
    }
    
    // ---------- USE EFFECTS ---------- \\
    useEffect(() => {
        // console.log('Game Board Check', playerdeck)
        //Game setup, shuffles deck and draws 5 cards for hand
        let shuffledDeck = shuffle(playerdeck);
        let initialHand = drawHand(shuffledDeck)
        setDeck(shuffledDeck);
        setHand(initialHand);

        //Checks to see if this client is first in turn order
        if(turnOrder[0] === user.id){
            //Tells back end this client is beginning turn
            socket.emit('start_draw_phase', {
                user_id:user.id,
                room_id:room_id,
                turn_number:1
            })
        }

        // ---------- DRAW PHASE ---------- \\

        //Notifies both clients when one client starts draw phase
        socket.on("draw_phase_start", data => {
            //Checks to see if it's this client's turn
            if(data.user_id === user.id) {
                //Deck check sends "game lost" if there are no more cards in deck
                setDrawPhase(true);
                setLog((prev) => ['draw phase start!', data.log, ...prev])
            }
            //Updates both users' turn count
            setTurnNumber(data.turn_number);
        })


        //Updates both clients on user card draw
        socket.on("card_drawn", data => {
            //If this client drew card
            if(data.user_id === user.id) {
                //Deactivates draw phase
                setDrawPhase(false);
                //Tells backed this client is starting next phase
                socket.emit("start_placement_phase", {
                    user_id: user.id,
                    room_id: room_id,
                })
            }else {
                //If this client did not draw card, the other user did 
                //updates opponent info
                setOpponentHand(data.hand_size);
                setOpponentDeck(data.deck_size);
            }
            //Updates' both client's logs with the same info
            setLog((prev) => [data.log, ...prev])
        })

        // ---------- PLACEMENT PHASE ---------- \\

        //Notifies both clients that someone has started placement phase
        socket.on("placement_phase_start", data => {
            //If this user is starting placement phase
            if(data.user_id === user.id) {
                //Activate placement phase
                setLog((prev) => ['Placement Phase Start!', ...prev])
                setPlacementPhase(true);
            }
        })

        //Notifies both clients that unit card was placed
        socket.on("unit_placed", data => {
            //If this user placed card
            if(data.user_id === user.id) {
                //Checks which slot unit was placed in
                if(data.unit_slot == 1){
                    setPlayerUnitSlot1(data.card_type)
                }
                if(data.unit_slot == 2){
                    setPlayerUnitSlot2(data.card_type)
                }
                if(data.unit_slot == 3){
                    setPlayerUnitSlot3(data.card_type)
                }
            }else{
                //If other user placed card
                //Update appropriate opponent slots
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

            //Updates logs of both clients
            setLog((prev) => [data.log, ...prev])
        })

        //Spell Used updates both clients when a spell is used
        socket.on("spell_used", data => {
            //if this client used spell
            if(data.user_id === user.id){

                //Updates opponent health if changes
                if(data.opp_health) setOpponentHealth(data.opp_health)

                //updates user health if changes
                if(data.user_health) {
                    //ends game of spell kills client
                    if(data.user_health < 0) {
                        socket.emit('end_game', {
                            loser_id:user.id,
                            room_id:room_id,
                        })
                    }
                    setPlayerHealth(data.user_health)
                    // console.log('Setting Player Health To ' + data.user_health)
                }

                //Handles destruction effects
                if(data.destroy) {
                    if(data.destroy.includes(1)) {
                        setOpponentUnitSlot1(null);
                        explosionHandler(4)
                    }
                    if(data.destroy.includes(2)) {
                        setOpponentUnitSlot2(null);
                        explosionHandler(5)
                    }
                    if(data.destroy.includes(3)) {
                        setOpponentUnitSlot3(null);
                        explosionHandler(6)
                    }
                }

                //Handle stat changes
                if(data.pu1) setPlayerUnitSlot1(data.pu1)
                if(data.pu2) setPlayerUnitSlot2(data.pu2)
                if(data.pu3) setPlayerUnitSlot3(data.pu3)
                if(data.ou1) setOpponentUnitSlot1(data.ou1)
                if(data.ou2) setOpponentUnitSlot2(data.ou2)
                if(data.ou3) setOpponentUnitSlot3(data.ou3)
            }else {
                //If opponent used spell 

                //Updates deck if changes
                if(data.deck_size) setOpponentDeck(data.deck_size)

                //Updates hand if changes
                if(data.hand_size) setOpponentHand(data.hand_size)

                //Updates opponent health if changes 
                if(data.opp_health) {
                    if(data.opp_health <= 0) {
                        socket.emit('end_game', {
                            loser_id:user.id,
                            room_id:room_id,
                        })
                    }
                    setPlayerHealth(data.opp_health)
                    // console.log('Setting Player Health To ' + data.opp_health)
                }

                //updates user health if changes
                if(data.user_health) setOpponentHealth(data.user_health)

                //Handles destruction effects
                if(data.destroy) {
                    if(data.destroy.includes(1)) {
                        setPlayerUnitSlot1(null);
                        explosionHandler(1)
                    }
                    if(data.destroy.includes(2)) {
                        setPlayerUnitSlot2(null);
                        explosionHandler(2)
                    }
                    if(data.destroy.includes(3)) {
                        setPlayerUnitSlot3(null);
                        explosionHandler(3)
                    }
                }

                //Handle stat changes
                if(data.pu1) setOpponentUnitSlot1(data.pu1)
                if(data.pu2) setOpponentUnitSlot2(data.pu2)
                if(data.pu3) setOpponentUnitSlot3(data.pu3)
                if(data.ou1) setPlayerUnitSlot1(data.ou1)
                if(data.ou2) setPlayerUnitSlot2(data.ou2)
                if(data.ou3) setPlayerUnitSlot3(data.ou3)
            }

            //Updates log of both users
            setLog((prev) => [data.log, ...prev])
        })

        // ---------- COMBAT PHASE ---------- \\

        //Updates both clients that combat phase has started
        socket.on("combat_phase_start", data => {
            //If this client combat phase
            if (data.user_id === user.id){
                //Ends placement phase, begins combat phase
                setPlacementPhase(false)
                setCombatPhase(true)
            }
            //Updates log of both clients
            setLog((prev) => [data.log, ...prev])
        })

        //Updates both clients when unit was placed
        socket.on('unit_attack', data => {
            //if this client attacked
            if(data.user_id === user.id){
                
                //If new health is below 1, end game
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

                //Updates both clients' health
                setOpponentHealth(data.target_health);
                setPlayerHealth(data.user_health);
                // console.log('Setting Opponent Health To ' + data.target_health)
                // console.log('Setting Player Health To ' + data.user_health)
                

                //If combat was a loss, destroy player unit that attacked
                if(data.loss || data.tie){
                    if(data.attacker_slot === 1) setPlayerUnitSlot1(null)
                    if(data.attacker_slot === 2) setPlayerUnitSlot2(null)
                    if(data.attacker_slot === 3) setPlayerUnitSlot3(null)
                    explosionHandler(data.attacker_slot)
                }

                //If combat was a win or tie, destroys opponent's monster
                if((data.defender_slot === 1) && !data.loss){
                    setOpponentUnitSlot1(null);
                    explosionHandler(data.defender_slot + 3)
                }
                if((data.defender_slot === 2) && !data.loss){
                    setOpponentUnitSlot2(null);
                    explosionHandler(data.defender_slot + 3)
                }
                if((data.defender_slot === 3) && !data.loss){
                    setOpponentUnitSlot3(null);
                    explosionHandler(data.defender_slot + 3)
                }
            }else {
                //If other user attacked
                //Update both players' health
                setPlayerHealth(data.target_health);
                setOpponentHealth(data.user_health);
                // console.log('Setting Opponent Health To ' + data.user_health)
                // console.log('Setting Player Health To ' + data.target_health)

                //Destroy attacking monster if loss or tie
                if(data.loss || data.tie){
                    if(data.attacker_slot === 1) setOpponentUnitSlot1(null)
                    if(data.attacker_slot === 2) setOpponentUnitSlot2(null)
                    if(data.attacker_slot === 3) setOpponentUnitSlot3(null)
                    explosionHandler(data.attacker_slot + 3)
                }

                //Destroy defending monster if loss or tie
                if(data.defender_slot === 1  && !data.loss){
                    setPlayerUnitSlot1(null);
                    explosionHandler(data.defender_slot)
                    
                }
                if(data.defender_slot === 2  && !data.loss){
                    setPlayerUnitSlot2(null);
                    explosionHandler(data.defender_slot)
                }
                if(data.defender_slot === 3  && !data.loss){
                    setPlayerUnitSlot3(null);
                    explosionHandler(data.defender_slot)
                }
            
        }

        //Updates both clients log
        setLog((prev) => [data.log, ...prev])
    })

    // ---------- END TURN ---------- \\

    //Ends turn
        socket.on('turn_ended', data => {
            //If user who just had turn,
            //Resets all relevant values
            if (data.user_id === user.id){
                setCombatPhase(false)
                setUnitPlaced(false)
                setTrapPlaced(false)
                setSelectedUnit(null)
                setSelUnitSlot(null)
                setHasAttacked([])
                setSelected(null)
                //Sends next user's ID to backend
                let userId;
                if(turnOrder[0] === user.id){
                    userId = turnOrder[1]
                }else{
                    userId = turnOrder[0]
                }
                //Tells backend to start next turn
                socket.emit("start_draw_phase", {
                    room_id:room_id,
                    user_id: userId,
                    turn_number: turnNumber + 1
                })
            }
            //Updates both clients
            setLog((prev) => [data.log, ...prev])
        })

        //Unsubscribes from socket events on unmount
        return () => {
            socket.removeAllListeners();
        }

    }, [])

    // ---------- DRAW PHASE ---------- \\

    //Adds card to hand, and emits draw event to both clients
    const drawButtonHandler = () => {
        //Checks deck length to make sure there are cards left
        if(deck.length > 0){
            //Draws card and modifies both hand and deck
            drawCard(1)
            //Updates both users about it
            socket.emit('draw_card', {
                room_id:room_id,
                user_id: user.id,
                hand_size: (hand.length + 1),
                deck_size: (deck.length - 1),
                log: `${user.username} draws card!`
            })
        }else{
            //Emits end game if player cannot draw
            socket.emit('end_game', {
                loser_id:user.id,
                room_id:room_id,
            })

        }
    }

    //Adds card to hand and removes it from deck
    const drawCard = () => {
        let d = [...deck]
        let h = [...hand]
        let card = d.pop()
        h.push(card)
        setHand(h)
        setDeck(d)
    }

    const drawCardSpell = (amt, card_id) => {
        let d = [...deck]
        let th = [...hand]
        let h = th.filter(c => c.id != card_id);
        for(let i = 0; i < amt; i++){
            // console.log('Draw Card Spell Loop', h)
            let card = d.pop()
            h.push(card)
        }
        setDeck(d)
        setHand(h)
    }

    // ---------- PLACEMENT PHASE ---------- \\

    const playerUnitSlotHandler = (int) => {
        //Handles placing unit cards from hand AND selecting unit for combat
        //Must be placement phase, have a unit card selected, and not placed a card yet this turn
        if(placementPhase && selected && (selected.card_type.type === 'unit')){

            let attack_power_up = null;
            let defense_power_up = null;
            let evolution = false;
            //If has evolution,
            //Evolution mechanic restraints
            if(selected.card_type.evolution_name) {
                if(int === 1 && !playerUnitSlot1) return;
                if(int === 2 && !playerUnitSlot2) return;
                if(int === 3 && !playerUnitSlot3) return;
                
                if(int === 1 && playerUnitSlot1.name != selected.card_type.evolution_name) return;
                if(int === 2 && playerUnitSlot2.name != selected.card_type.evolution_name) return;
                if(int === 3 && playerUnitSlot3.name != selected.card_type.evolution_name) return;

                if(int === 1 && playerUnitSlot1.attack_power_up) attack_power_up = playerUnitSlot1.attack_power_up
                if(int === 2 && playerUnitSlot2.attack_power_up) attack_power_up = playerUnitSlot2.attack_power_up
                if(int === 3 && playerUnitSlot3.attack_power_up) attack_power_up = playerUnitSlot3.attack_power_up

                if(int === 1 && playerUnitSlot1.defense_power_up) defense_power_up = playerUnitSlot1.defense_power_up
                if(int === 2 && playerUnitSlot2.defense_power_up) defense_power_up = playerUnitSlot2.defense_power_up
                if(int === 3 && playerUnitSlot3.defense_power_up) defense_power_up = playerUnitSlot3.defense_power_up

                //EXPERIMENTAL- sets evolution flag to true, allows for any number of evolutions to happen per turn
                evolution = true;

                let t = {...selected.card_type}
                if(attack_power_up) t.attack += attack_power_up
                if(defense_power_up) t.defense += defense_power_up
                

                //Sends info to backend
                socket.emit('place_unit', {
                    room_id:room_id,
                    user_id: user.id,
                    hand_size: (hand.length - 1),
                    card_type: t,
                    unit_slot: int,
                    log: `${user.username} places ${selected.card_type.name}`
                })

                //Removes card from hand
                    removeFromHand(selected)
                //Resets selected
                    setSelected(null);

            } else if (!unitPlaced) {
                //If no evolution
                //Prevents placing cards on taken slots
                if(int === 1 && playerUnitSlot1) return;
                if(int === 2 && playerUnitSlot2) return;
                if(int === 3 && playerUnitSlot3) return;
                
                //Sends info to backend
                socket.emit('place_unit', {
                    room_id:room_id,
                    user_id: user.id,
                    hand_size: (hand.length - 1),
                    card_type: selected.card_type,
                    unit_slot: int,
                    log: `${user.username} places ${selected.card_type.name}`
                })
                
                //Resets selected
                setSelected(null);
                //prevents multiple placements, allows for infinite evolutions
                setUnitPlaced(true);
                //Removes card from hand
                removeFromHand(selected)
            }
        }

        //COMBAT PHASE selector
        if(combatPhase){
            if(int === 1 && playerUnitSlot1 && !hasAttacked.includes(1)) {
                setSelectedUnit(playerUnitSlot1);
                setSelUnitSlot(int)
            }
            if(int === 2 && playerUnitSlot2 && !hasAttacked.includes(2)) {
                setSelectedUnit(playerUnitSlot2);
                setSelUnitSlot(int)
            }
            if(int === 3 && playerUnitSlot3 && !hasAttacked.includes(3)) {
                setSelectedUnit(playerUnitSlot3);
                setSelUnitSlot(int)
            }
        }
    }

    const spellEffect = (card) => {
        //Spell Effect parses spell card effect into backend Message

        //Splits str to array and grabs needed info
        const effArr = card.effect.split(':')
        const effType = effArr[0]
        const effAmt = effArr[1]
        let targets = [];
        let payload = {}

        //Switch parses effect type and emits use spell to update clients
        switch(effType) {
            //Damage deals direct damage to opponent's health
            case 'damage':
                const oh = opponentHealth - Number(effAmt);
                socket.emit('use_spell', {
                    room_id: room_id,
                    user_id: user.id,
                    hand_size: hand.length,
                    effect:'damage',
                    opp_health:oh,
                    log: `${user.username} activates ${card.name}!  ${effAmt} Damage!`
                })
                break;

            //Heal heals player's health
            case 'heal':
                const ph = playerHealth + Number(effAmt)
                socket.emit('use_spell', {
                    room_id: room_id,
                    user_id: user.id,
                    effect:'heal',
                    user_health:ph,
                    log: `${user.username} activates ${card.name}!  ${effAmt} Healed!`
                })
                break;

            //Draw amt of cards from deck
            case 'draw':
                if(deck.length - effAmt <= 0){
                    socket.emit('end_game', {
                        loser_id:user.id,
                        room_id:room_id
                    })
                }else{
                    socket.emit('use_spell', {
                        room_id: room_id,
                        user_id: user.id,
                        hand_size: hand.length - effAmt, 
                        deck_size: deck.length - effAmt,
                        log: `${user.username} activates ${card.name}! ${effAmt} cards drawn!`
                    })
                }
                break;

            //Destroys opposing units with defense below a certain amount
            case 'destroyOpponentUnitsBelowDef':
                if(opponentUnitSlot1 && opponentUnitSlot1.defense < effAmt) targets.push(1)
                if(opponentUnitSlot2 && opponentUnitSlot2.defense < effAmt) targets.push(2)
                if(opponentUnitSlot3 && opponentUnitSlot3.defense < effAmt) targets.push(3)
                
                socket.emit('use_spell', {
                    room_id: room_id,
                    user_id: user.id,
                    destroy: targets,
                    log: `${user.username} activates ${card.name}!  ${targets.length} units destroyed!`
                })
            break;
            
            case 'destroyOpponentUnitsAboveDef':
                if(opponentUnitSlot1 && opponentUnitSlot1.defense > effAmt) targets.push(1)
                if(opponentUnitSlot2 && opponentUnitSlot2.defense > effAmt) targets.push(2)
                if(opponentUnitSlot3 && opponentUnitSlot3.defense > effAmt) targets.push(3)
                
                socket.emit('use_spell', {
                    room_id: room_id,
                    user_id: user.id,
                    destroy: targets,
                    log: `${user.username} activates ${card.name}!  ${targets.length} units destroyed!`
                })
            break;

            case 'destroyOpponentUnitsBelowAtt':
                if(opponentUnitSlot1 && opponentUnitSlot1.attack < effAmt) targets.push(1)
                if(opponentUnitSlot2 && opponentUnitSlot2.attack < effAmt) targets.push(2)
                if(opponentUnitSlot3 && opponentUnitSlot3.attack < effAmt) targets.push(3)
                
                socket.emit('use_spell', {
                    room_id: room_id,
                    user_id: user.id,
                    destroy: targets,
                    log: `${user.username} activates ${card.name}!  ${targets.length} units destroyed!`
                })
            break;

            case 'destroyOpponentUnitsAboveAtt':
                if(opponentUnitSlot1 && opponentUnitSlot1.attack > effAmt) targets.push(1)
                if(opponentUnitSlot2 && opponentUnitSlot2.attack > effAmt) targets.push(2)
                if(opponentUnitSlot3 && opponentUnitSlot3.attack > effAmt) targets.push(3)
                
                socket.emit('use_spell', {
                    room_id: room_id,
                    user_id: user.id,
                    destroy: targets,
                    log: `${user.username} activates ${card.name}!  ${targets.length} units destroyed!`
                })
            break;

            case 'increaseAllAttack':
                payload.room_id = room_id
                payload.user_id = user.id

                //Clone each card object and modify necessary values
                if(playerUnitSlot1) {
                    let t = {...playerUnitSlot1}
                    // console.log(t)
                    t.attack = Number(t.attack) + Number(effAmt);
                    if(t.attack_power_up) {
                        t.attack_power_up += Number(effAmt);
                    }else{
                        t.attack_power_up = Number(effAmt);
                    }
                    payload.pu1 = t;
                }

                if(playerUnitSlot2) {
                    let t = {...playerUnitSlot2}
                    // console.log(t)
                    t.attack = Number(t.attack) + Number(effAmt);
                    if(t.attack_power_up) {
                        t.attack_power_up += Number(effAmt);
                    }else{
                        t.attack_power_up = Number(effAmt);
                    }
                    payload.pu2 = t;
                }

                if(playerUnitSlot3) {
                    let t = {...playerUnitSlot3}
                    // console.log(t)
                    t.attack = Number(t.attack) + Number(effAmt);
                    if(t.attack_power_up) {
                        t.attack_power_up += Number(effAmt);
                    }else{
                        t.attack_power_up = Number(effAmt);
                    }
                    payload.pu3 = t;
                }

                //Adds to log
                payload.log = `${user.username} plays ${card.name}!  Powers up all units' attack by ${effAmt}`

                //Payload is a variable used that contains all necessary info
                socket.emit('use_spell', payload);
            break;

            case 'increaseAllDefense':
                payload.room_id = room_id
                payload.user_id = user.id

                //Clone each card object and modify necessary values
                if(playerUnitSlot1) {
                    let t = {...playerUnitSlot1}
                    t.defense += Number(effAmt);
                    if(t.defense_power_up) {
                        t.defense_power_up += Number(effAmt);
                    }else{
                        t.defense_power_up = Number(effAmt);
                    }
                    payload.pu1 = t;
                }

                if(playerUnitSlot2) {
                    let t = {...playerUnitSlot2}
                    t.defense += Number(effAmt);
                    if(t.defense_power_up) {
                        t.defense_power_up += Number(effAmt);
                    }else{
                        t.defense_power_up = Number(effAmt);
                    }
                    payload.pu2 = t;
                }

                if(playerUnitSlot3) {
                    let t = {...playerUnitSlot3}
                    t.defense += Number(effAmt);
                    if(t.defense_power_up) {
                        t.defense_power_up += Number(effAmt);
                    }else{
                        t.defense_power_up = Number(effAmt);
                    }
                    payload.pu3 = t;
                }

                //Adds to log
                payload.log = `${user.username} plays ${card.name}!  Powers up all units' defense by ${effAmt}`

                //Payload is a variable used that contains all necessary info
                socket.emit('use_spell', payload);
            break;

            case 'decreaseAllAttack':
                payload.room_id = room_id
                payload.user_id = user.id

                //Clone each card object and modify necessary values
                if(opponentUnitSlot1) {
                    let t = {...opponentUnitSlot1}
                    t.attack -= Number(effAmt);
                    if(t.attack < 0) t.attack = 0
                    payload.ou1 = t;
                }

                if(opponentUnitSlot2) {
                    let t = {...opponentUnitSlot2}
                    t.attack -= Number(effAmt);
                    if(t.attack < 0) t.attack = 0
                    payload.ou2 = t;
                }

                if(opponentUnitSlot3) {
                    let t = {...opponentUnitSlot3}
                    t.attack -= Number(effAmt);
                    if(t.attack < 0) t.attack = 0
                    payload.ou3 = t;
                }

                //Adds to log
                payload.log = `${user.username} plays ${card.name}!  Decreases all ${gameData.opponent_name}'s units' attack by ${effAmt}`

                //Payload is a variable used that contains all necessary info
                socket.emit('use_spell', payload);
            break;

            
            case 'decreaseAllDefense':
                payload.room_id = room_id
                payload.user_id = user.id

                //Clone each card object and modify necessary values
                if(opponentUnitSlot1) {
                    let t = {...opponentUnitSlot1}
                    t.defense -= Number(effAmt);
                    if(t.defense < 0) t.defense = 0
                    payload.ou1 = t;
                }

                if(opponentUnitSlot2) {
                    let t = {...opponentUnitSlot2}
                    t.defense -= Number(effAmt);
                    if(t.defense < 0) t.defense = 0
                    payload.ou2 = t;
                }

                if(opponentUnitSlot3) {
                    let t = {...opponentUnitSlot3}
                    t.defense -= Number(effAmt);
                    if(t.defense < 0) t.defense = 0
                    payload.ou3 = t;
                }

                //Adds to log
                payload.log = `${user.username} plays ${card.name}!  Decreases all ${gameData.opponent_name}'s units' defense by ${effAmt}`

                //Payload is a variable used that contains all necessary info
                socket.emit('use_spell', payload);
            break;

        }
    }

    // ---------- COMBAT PHASE ---------- \\
    const beginCombatPhase = () => {
        //Combat phase emitter
        //Rules prohibit combat on turn 1.  Ends turn if pressed on turn 1.
        if(turnNumber === 1){
            setPlacementPhase(false)
            socket.emit('end_turn', {
                room_id: room_id,
                user_id: user.id,
                turn_number: turnNumber,
                log: `${user.username} ends their turn.`
            })
        }else {
            //Progresses both clients to combat phase
            socket.emit('start_combat_phase', {
                room_id:room_id,
                user_id: user.id,
                log: `${user.username} begins their combat phase!`
            })
        }
    }

    const opponentUnitSlotHandler = (int) => {
        //Handles opponent unit slot targeting for combat.

        if(opponentUnitSlot1 || opponentUnitSlot2 || opponentUnitSlot3){

            //If opponent has a unit on the field, you cannot target an empty slot to attack them directly.
            if(int === 1 && !opponentUnitSlot1) return;
            if(int === 2 && !opponentUnitSlot2) return;
            if(int === 3 && !opponentUnitSlot3) return;

            //Checks that selected unit can attack
            if(combatPhase && selectedUnit && !hasAttacked.includes(selUnitSlot)){
                //pushes unit onto limiter array to prevent second attack
                setHasAttacked([...hasAttacked, selUnitSlot])
                let results;
                let targetName;

                //Does math
                if(int === 1){
                    results = selectedUnit.attack - opponentUnitSlot1.defense
                    targetName = opponentUnitSlot1.name
                }
                if(int === 2){
                    results = selectedUnit.attack - opponentUnitSlot2.defense
                    targetName = opponentUnitSlot2.name
                }
                if(int === 3){
                    results = selectedUnit.attack - opponentUnitSlot3.defense
                    targetName = opponentUnitSlot3.name
                }

                //Calculates health points and losses
                let userHealth = playerHealth
                let targetHealth = opponentHealth
                let loss = false;
                if(results > 0){
                    targetHealth -= results;
                }else{
                    loss = true;
                    userHealth += results;
                }

                let tie = false;
                if (results === 0){
                    tie = true;
                }

                //Sends results to both clients
                socket.emit('attack', {
                    room_id:room_id,
                    user_id:user.id,
                    attacker_slot:selUnitSlot,
                    defender_slot:int,
                    results:results,
                    user_health:userHealth,
                    target_health:targetHealth,
                    tie:tie,
                    loss:loss,
                    log: `${user.username} attacks ${targetName} with ${selectedUnit.name}!`
                })
                setSelectedUnit(null);
                setSelUnitSlot(null);
            }
        }else{
            //Handles attacking an undefended opponent
            //Must have unit selected and be able to attack
            if(combatPhase && selectedUnit && !hasAttacked.includes(selUnitSlot)){

                //pushes unit onto limiter array to prevent second attack
                setHasAttacked([...hasAttacked, selUnitSlot])

                //Calculates damage
                let userHealth = playerHealth
                let targetHealth = opponentHealth

                targetHealth -= selectedUnit.attack

                //Does the same thing all the other emits do
                socket.emit('attack', {
                    room_id:room_id,
                    user_id:user.id,
                    attacker_slot:selUnitSlot,
                    defender_slot:int,
                    results:selectedUnit.attack,
                    user_health:userHealth,
                    target_health:targetHealth,
                    log: `${user.username} attacks ${gameData.opponent_name} directly with ${selectedUnit.name}!!!`
                })
                setSelectedUnit(null);
                setSelUnitSlot(null);
            }
        }  
              
    }

    //Sends the end turn thing on the button
    const endTurnHandler = () => {
        setPlacementPhase(false);
        socket.emit('end_turn', {
            room_id: room_id,
            user_id: user.id,
            turn_number: turnNumber,
            log: `${user.username} ends their turn.`
        })
    }

    //Toggles expanded log size
    const expandLogHandler = () => {
        setLogToggle((prev) => !prev)
    }

    const explosionHandler = (t) => {
        switch(t) {
            case 1:
                setExplosionEffect1(true)
                setTimeout(() => {
                    setExplosionEffect1(false)
                }, 650)
                break;
            case 2:
                setExplosionEffect2(true)
                setTimeout(() => {
                    setExplosionEffect2(false)
                }, 650)
                break;
            case 3:
                setExplosionEffect3(true)
                setTimeout(() => {
                    setExplosionEffect3(false)
                }, 650)
                break;
            case 4:
                setExplosionEffect4(true)
                setTimeout(() => {
                    setExplosionEffect4(false)
                }, 650)
                break;
            case 5:
                setExplosionEffect5(true)
                setTimeout(() => {
                    setExplosionEffect5(false)
                }, 650)
                break;
            case 6:
                setExplosionEffect6(true)
                setTimeout(() => {
                    setExplosionEffect6(false)
                }, 650)
                break;
        }
    }

    // ---------- JSX ---------- \\

    return (
        <div className={styles.boardWrapper}>
            <div className={logToggle ? styles.logWrapperLarge : styles.logWrapperSmall} onClick={expandLogHandler}>
                {log.length > 0 && log.map(message => <p>{message}</p>)}
            </div>


            {/* {selected && <p> Selected Hand = {selected.card_type.name} </p>}
            {selectedUnit && <p> Selected Unit = {selectedUnit.name} </p>} */}

            <div className={styles.boardContainer}>
                <div className={styles.opponentUnitBoard}>
                    <div className={selectedUnit ? styles.opponentUnitCombatPhase: styles.opponentUnit} onClick={() => opponentUnitSlotHandler(1)}>
                        {opponentUnitSlot1 && <BoardCardDisplay card={opponentUnitSlot1} />}
                        {explosionEffect4 && <img src={explosion} className={styles.explosionEffect} />}
                    </div>
                    <div className={selectedUnit ? styles.opponentUnitCombatPhase: styles.opponentUnit} onClick={() => opponentUnitSlotHandler(2)}>
                        {opponentUnitSlot2 && <BoardCardDisplay card={opponentUnitSlot2} />}
                        {explosionEffect5 && <img src={explosion} className={styles.explosionEffect} />}
                    </div>
                    <div className={selectedUnit ? styles.opponentUnitCombatPhase: styles.opponentUnit} onClick={() => opponentUnitSlotHandler(3)}>
                        {opponentUnitSlot3 && <BoardCardDisplay card={opponentUnitSlot3} />}
                        {explosionEffect6 && <img src={explosion} className={styles.explosionEffect} />}
                    </div>
                    <div className={styles.infoWrapper}>
                        <GamePlayerInfoContainer 
                        playerName={gameData.opponent_name}
                        handSize={opponentHand}
                        deckSize={opponentDeck}
                        health={opponentHealth} />
                    </div>
                </div>


                <div className={styles.playerUnitBoard}>
                    <div className={selUnitSlot === 1 ? styles.playerUnitSelected : combatPhase && !selectedUnit && !hasAttacked.includes(1) && playerUnitSlot1 ? styles.playerUnitCombatPhase : placementPhase && selected ? styles.playerUnitCombatPhase : styles.playerUnit} onClick={() => playerUnitSlotHandler(1)}>
                        {playerUnitSlot1 && <BoardCardDisplay card={playerUnitSlot1} />}
                        {explosionEffect1 && <img src={explosion} className={styles.explosionEffect} />}
                    </div>
                    <div className={selUnitSlot === 2 ? styles.playerUnitSelected : combatPhase && !selectedUnit && !hasAttacked.includes(2) && playerUnitSlot2 ? styles.playerUnitCombatPhase : placementPhase && selected ? styles.playerUnitCombatPhase : styles.playerUnit} onClick={() => playerUnitSlotHandler(2)}>
                        {playerUnitSlot2 && <BoardCardDisplay card={playerUnitSlot2} />}
                        {explosionEffect2 && <img src={explosion} className={styles.explosionEffect} />}
                    </div>
                    <div className={selUnitSlot === 3 ? styles.playerUnitSelected : combatPhase && !selectedUnit && !hasAttacked.includes(3) && playerUnitSlot3 ? styles.playerUnitCombatPhase : placementPhase && selected ? styles.playerUnitCombatPhase : styles.playerUnit} onClick={() => playerUnitSlotHandler(3)}>
                        {playerUnitSlot3 && <BoardCardDisplay card={playerUnitSlot3} />}
                        {explosionEffect3 && <img src={explosion} className={styles.explosionEffect} />}
                    </div>

                    <div className={styles.infoWrapper}>
                        <GamePlayerInfoContainer 
                        playerName={user.username}
                        handSize={hand.length}
                        deckSize={deck.length}
                        health={playerHealth} />

                    </div>
                </div>
            </div>

            <div className={styles.handWrapper}>
            {hand && hand.map((card, i) => (
                <div onClick={() => handSelector(i)} className={(selected && selected.id === card.id) ? styles.selectedHandCard : placementPhase && card.card_type.type === 'spell' ? styles.placeableSpellCard : placementPhase ? styles.placeableHandCard : styles.handCard}>
                    <CardDisplay card={card.card_type} />
                </div>
                )) }
            </div>

            {drawPhase && (
                <button className={styles.actionButton} onClick={drawButtonHandler}>Draw Card!!</button>
            )}

            {placementPhase && turnNumber > 1 && (
                <button className={styles.actionButton} onClick={beginCombatPhase}>Start Combat Phase!</button>
            )}

            {combatPhase && (
                <button className={styles.actionButton} onClick={endTurnHandler}>End Turn</button>
            )}

            {placementPhase && turnNumber === 1 && (
                <button className={styles.actionButton} onClick={endTurnHandler}>End Turn</button>
            )}

            {gameData.opponent_name !== 'Duel Bot' && <GameChat socket={socket} username={user.username} room_id={room_id} />}
            
            <button className={styles.helpButton} onClick={() => setHelpModal(true)}>Help</button>
            {helpModal && (
                <Modal onClose={() => setHelpModal(false)}>
                    <div style={{'background-color':'white', 'text-align':'center', 'border-radius':'35px'}}>
                        <RulesPage />
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default GameBoard;