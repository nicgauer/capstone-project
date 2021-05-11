import React, {useEffect, useState} from 'react';


const shuffle = (array) => {
    // console.log(array, "SHUFFLE");
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
    // console.log(h)
    // console.log(deck)
    return h
}

const AI = ({socket, gameData, AIdeck}) => {
    const room_id = gameData.room_id;
    const turnOrder = gameData.turn_order;
    const user = {
        username:'Duel Bot',
        id:0
    }
    // const [turnNumber, setTurnNumber] = useState(1);
    // const [playerHealth, setPlayerHealth] = useState(1000);
    // const [opponentHealth, setOpponentHealth] = useState(1000);

    let turnNumber = 1;
    let playerHealth = 1000;
    let opponentHealth = 1000;

    // let drawPhase = false;
    // let placementPhase = false;
    // let combatPhase = false;
    // let d = shuffle([...AIdeck]);
    // let h = drawHand(d);

    // const [hand, setHand] = useState([]);
    // const [deck, setDeck] = useState(AIdeck);

    let deck = shuffle(AIdeck);
    let hand = drawHand(deck);

    let playerUnitSlot1 = null;
    let playerUnitSlot2 = null;
    let playerUnitSlot3 = null;

    let opponentUnitSlot1 = null;
    let opponentUnitSlot2 = null;
    let opponentUnitSlot3 = null;

    // const [playerUnitSlot1, setPlayerUnitSlot1] = useState(null);
    // const [playerUnitSlot2, setPlayerUnitSlot2] = useState(null);
    // const [playerUnitSlot3, setPlayerUnitSlot3] = useState(null);

    // const [opponentUnitSlot1, setOpponentUnitSlot1] = useState(null);
    // const [opponentUnitSlot2, setOpponentUnitSlot2] = useState(null);
    // const [opponentUnitSlot3, setOpponentUnitSlot3] = useState(null);

    // ----- HELPERS ----- \\

    const rng = (max) => {
        return Math.floor(Math.random() * max);
    }


    const removeFromHand = (card) => {
        let h = [...hand]
        // setHand(h.filter(c => c.id != card.id));
        hand = h.filter(c => c.id != card.id)
        console.log('remove from hand hand', hand);
    }


    useEffect(() => {
        // let shuffledDeck = shuffle(AIdeck);
        // let initialHand = drawHand(shuffledDeck)
        // setDeck(shuffledDeck);
        // setHand(initialHand);

        //Checks to see if this client is first in turn order
        if(turnOrder[0] === user.id){
            //Tells back end this client is beginning turn
            console.log('AI starting first turn')
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
                console.log('AI starting draw!')
                //if AI's turn, activate draw phase flag
                drawPhase()
            }
            //Updates both users' turn count
            // setTurnNumber(data.turn_number);
            turnNumber = data.turn_number;
        })

        socket.on("card_drawn", data => {
            //If AI drew card
            if(data.user_id === user.id) {
                console.log('AI drew card!')
                // let waitAmt = 500 * rng(5)
                // setTimeout(() => {
                //     //Tells backed this client is starting next phase
                    // socket.emit("start_placement_phase", {
                    //     user_id: user.id,
                    //     room_id: room_id,
                    // })

                    socket.emit("start_placement_phase", {
                        user_id: user.id,
                        room_id: room_id,
                    })
                // }, waitAmt)
            }
        })
        
        // ---------- PLACEMENT PHASE ---------- \\

        socket.on("placement_phase_start", data => {
            //If this user is starting placement phase
            if(data.user_id === user.id) {
                console.log('AI is starting placement phase!')
                placementPhase();
            }
        })

        //Spell Used updates both clients when a spell is used
        socket.on("spell_used", data => {
            //if this client used spell
            if(data.user_id === user.id){

                //Updates opponent health if changes
                // if(data.opp_health) setOpponentHealth(data.opp_health);
                if(data.opp_health) opponentHealth = data.opp_health

                //updates user health if changes
                if(data.user_health) {
                    //ends game of spell kills client
                    if(data.user_health < 0) {
                        socket.emit('end_game', {
                            loser_id:user.id,
                            room_id:room_id,
                        })
                    }
                    // setPlayerHealth(data.user_health);
                    playerHealth = data.user_health;
                }

                //Handles destruction effects
                if(data.destroy) {
                    if(data.destroy.includes(1)) {
                        opponentUnitSlot1 = null;
                    }
                    if(data.destroy.includes(2)) {
                        opponentUnitSlot2 = null;
                    }
                    if(data.destroy.includes(3)) {
                        opponentUnitSlot3 = null;
                    }
                }

                //Handle stat changes
                if(data.pu1) playerUnitSlot1 = data.pu1;
                if(data.pu2) playerUnitSlot2 = data.pu2;
                if(data.pu3) playerUnitSlot3 = data.pu3;
                if(data.ou1) opponentUnitSlot1 = data.ou1;
                if(data.ou2) opponentUnitSlot2 = data.ou2;
                if(data.ou3) opponentUnitSlot3 = data.ou3;
            }else {
                //If opponent used spell 

                // //Updates deck if changes
                // if(data.deck_size) setOpponentDeck(data.deck_size)

                // //Updates hand if changes
                // if(data.hand_size) setOpponentHand(data.hand_size)

                //Updates opponent health if changes 
                if(data.opp_health) {
                    if(data.opp_health <= 0) {
                        socket.emit('end_game', {
                            loser_id:user.id,
                            room_id:room_id,
                        })
                    }
                    // setPlayerHealth(data.opp_health);
                    playerHealth = data.opp_health;
                }

                //updates user health if changes
                // if(data.user_health) setOpponentHealth(data.user_health)
                if(data.user_health) opponentHealth = data.user_health;

                //Handles destruction effects
                if(data.destroy) {
                    if(data.destroy.includes(1)) {
                        // setPlayerUnitSlot1(null);
                        playerUnitSlot1 = null;
                    }
                    if(data.destroy.includes(2)) {
                        // setPlayerUnitSlot2(null);
                        playerUnitSlot2 = null;
                    }
                    if(data.destroy.includes(3)) {
                        // setPlayerUnitSlot3(null);
                        playerUnitSlot3 = null;
                    }
                }

                //Handle stat changes
                if(data.pu1) opponentUnitSlot1 = data.pu1;
                if(data.pu2) opponentUnitSlot2 = data.pu2;
                if(data.pu3) opponentUnitSlot3 = data.pu3;
                if(data.ou1) playerUnitSlot1 = data.ou1;
                if(data.ou2) playerUnitSlot2 = data.ou2;
                if(data.ou3) playerUnitSlot3 = data.ou3;
            }
        })

        socket.on("unit_placed", data => {
            //If this user placed card
            if(data.user_id === user.id) {
                //Checks which slot unit was placed in
                if(data.unit_slot == 1){
                    playerUnitSlot1 = data.card_type;
                }
                if(data.unit_slot == 2){
                    playerUnitSlot2 = data.card_type;
                }
                if(data.unit_slot == 3){
                    playerUnitSlot3 = data.card_type;
                }
            }else{
                //If other user placed card
                //Update appropriate opponent slots
                if(data.unit_slot == 1){
                    opponentUnitSlot1 = data.card_type;
                }
                if(data.unit_slot == 2){
                    opponentUnitSlot2 = data.card_type;
                }
                if(data.unit_slot == 3){
                    opponentUnitSlot3 = data.card_type;
                }
            }
        })

        // ---------- COMBAT PHASE ---------- \\

        //Updates both clients that combat phase has started
        socket.on("combat_phase_start", data => {
            //If this client combat phase
            if (data.user_id === user.id){
                console.log("combat phase start")
                //Ends placement phase, begins combat phase
                // let waitAmt = 500 * rng(5)
                // setTimeout(() => {
                    //Activate placement phase
                    combatPhase()                    
                // }, waitAmt)
            }
        })

        //Updates both clients when unit was placed
        socket.on('unit_attack', data => {
            //if this client attacked
            if(data.user_id === user.id){
                console.log('unit attcked')

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
                    // setOpponentHealth(data.target_health);
                    // setPlayerHealth(data.user_health);
                    opponentHealth = data.target_health
                    playerHealth = data.user_health
    
                    //If combat was a loss, destroy player unit that attacked
                    if(data.loss || data.tie){
                        // if(data.attacker_slot === 1) setPlayerUnitSlot1(null)
                        // if(data.attacker_slot === 2) setPlayerUnitSlot2(null)
                        // if(data.attacker_slot === 3) setPlayerUnitSlot3(null)
                        if(data.attacker_slot === 1) playerUnitSlot1 = null
                        if(data.attacker_slot === 2) playerUnitSlot2 = null
                        if(data.attacker_slot === 3) playerUnitSlot3 = null
                    }
    
                    //If combat was a win or tie, destroys opponent's monster
                    if((data.defender_slot === 1) && !data.loss){
                        opponentUnitSlot1 = null;
                    }
                    if((data.defender_slot === 2) && !data.loss){
                        opponentUnitSlot2 = null;
                    }
                    if((data.defender_slot === 3) && !data.loss){
                        opponentUnitSlot3 = null;
                    }
                }else {
                    //If other user attacked
                    //Update both players' health
                    // setPlayerHealth(data.target_health);
                    // setOpponentHealth(data.user_health);
                    playerHealth = data.target_health;
                    opponentHealth = data.user_health;
    
                    //Destroy attacking monster if loss or tie
                    if(data.loss || data.tie){
                        if(data.attacker_slot === 1) opponentUnitSlot1 = null;
                        if(data.attacker_slot === 2) opponentUnitSlot2 = null;
                        if(data.attacker_slot === 3) opponentUnitSlot3 = null;
                    }
    
                    //Destroy defending monster if loss or tie
                    if(data.defender_slot === 1  && !data.loss){
                        playerUnitSlot1 = null;
                        
                    }
                    if(data.defender_slot === 2  && !data.loss){
                        playerUnitSlot2 = null;
                    }
                    if(data.defender_slot === 3  && !data.loss){
                        playerUnitSlot3 = null;
                    }
                }
            })

            // ---------- END TURN ---------- \\

    //Ends turn
        socket.on('turn_ended', data => {
            //If user who just had turn,
            //Resets all relevant values
            if (data.user_id === user.id){
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
        })


    }, [])


    // ---------- DRAW PHASE ---------- \\

    const drawPhase = () => {
        if(deck.length > 0){
            //Draws card from deck and adds it to hand
            drawCard()

            //Emits draw update to player
            socket.emit('draw_card', {
                room_id:room_id,
                user_id: user.id,
                hand_size: (hand.length + 1),
                deck_size: (deck.length - 1),
                log: `${user.username} draws card!`
            })
        }else {
            //Emits end game if AI cannot draw
            socket.emit('end_game', {
                loser_id:user.id,
                room_id:room_id,
            })
        }
    }

    //Adds card to hand and removes it from deck
    const drawCard = () => {
        console.log("pre draw card deck", deck);
        let d = [...deck]
        let h = [...hand]
        let card = d.pop()
        h.push(card)
        console.log("draw card deck", d)
        console.log("draw card hand", h)
        // setHand(h)
        // setDeck(d)
        hand = h;
        deck = d;
    }

    const drawCardSpell = (amt, card_id) => {
        let d = [...deck]
        let th = [...hand]
        let h = th.filter(c => c.id != card_id);
        for(let i = 0; i < amt; i++){
            console.log('Draw Card Spell Loop', h)
            let card = d.pop()
            h.push(card)
        }
        // setDeck(d)
        // setHand(h)
        hand = h;
        deck = d;
    }

    // ---------- PLACEMENT PHASE ---------- \\

    const placementPhase = () => {
        //spells
        let orgHand = {}
        orgHand.draw = [];
        orgHand.health = [];
        orgHand.destroy = [];
        orgHand.powerUp = [];
        orgHand.powerDown = [];
        
        //units
        orgHand.basicUnits = [];
        orgHand.evolvedUnits = [];
        
        //Hand sorting
        hand.forEach(card => {
            if(card.card_type.type === 'unit'){
                if(card.card_type.evolution_name){
                    orgHand.evolvedUnits.push(card);
                }else {
                    orgHand.basicUnits.push(card);
                }
            }else{
                let eff = card.card_type.effect.split(':')[0]
                if(eff === 'heal'){
                    orgHand.health.push(card);
                }
                if(eff === 'damage'){
                    orgHand.health.push(card);
                }
                if(eff === 'draw'){
                    orgHand.draw.push(card);
                }
                if(eff === 'destroyOpponentUnitsBelowDef' || eff === 'destroyOpponentUnitsBelowAtt' || eff === 'destroyOpponentUnitsAboveDef' || eff === 'destroyOpponentUnitsAboveAtt'){
                    orgHand.destroy.push(card);
                }
                if(eff === 'increaseAllAttack' || eff === 'increaseAllDefense'){
                    orgHand.powerUp.push(card);
                }
                if(eff === 'decreaseAllAttack' || eff === 'decreaseAllDefense') {
                    orgHand.powerDown.push(card);
                }
            }
        })
        console.log('hand after org', hand)
        console.log('Org Hand!!!', orgHand)

        placementStepOne(orgHand);
    }

    const placementStepOne = (orgHand) => {
        console.log('Placement Phase, Draw Card Phase')
        console.log("hand", hand)
        console.log("deck", deck)
        let draw = orgHand.draw
        if(orgHand.draw.length > 0){
            let played_spell = draw.pop();
            removeFromHand(played_spell);
            drawCardSpell(played_spell.card_type.effect.split(':')[1], played_spell.id)
            playSpell(played_spell.card_type);

            //Activate next placement phase step after waiting                   
            let waitAmt = 500 * rng(5)
                // setTimeout(() => {
                    placementStepTwo(orgHand);
                // }, waitAmt)
            }else{
            placementStepTwo(orgHand);
        }
    }

    const placementStepTwo = (orgHand) => {
        console.log('Thinking about playing health spell')
        if(orgHand.health.length > 0){
            let health = orgHand.health
            let played_spell = health.pop();
            removeFromHand(played_spell);
            playSpell(played_spell.card_type);
        }
        placementStepThree(orgHand);
    }

    const placementStepThree = (orgHand) => {
        console.log('Thinking about placing a damage spell')
        let destroy = orgHand.destroy;
        if(orgHand.destroy.length > 0){
            //Checks to see if opponent has a unit
            if(opponentUnitSlot1 || opponentUnitSlot2 || opponentUnitSlot3){
                let played_spell = null
    
                //Iterates through destroy cards in hand
                destroy.forEach(card => {
                    let c = card.card_type;
                    let eff = c.effect.split(':');
    
                    //Checks each unit slot to see if there is a match
                    //Ordered by priority, destroy stronger attack monsters with magic first
                    if(eff[0] === 'destroyOpponentUnitsBelowDef'){
                        if(opponentUnitSlot1 && opponentUnitSlot1.defense < eff[1] ||
                            opponentUnitSlot2 && opponentUnitSlot2.defense < eff[2] ||
                            opponentUnitSlot3 && opponentUnitSlot3.defense < eff[3]){
                                played_spell = c;
                        }
                    }
                    if(eff[0] === 'destroyOpponentUnitsBelowAtt'){
                        if(opponentUnitSlot1 && opponentUnitSlot1.attack < eff[1] ||
                            opponentUnitSlot2 && opponentUnitSlot2.attack < eff[2] ||
                            opponentUnitSlot3 && opponentUnitSlot3.attack < eff[3]){
                                played_spell = c;
                        }
                    }
                    if(eff[0] === 'destroyOpponentUnitsAboveDef'){
                        if(opponentUnitSlot1 && opponentUnitSlot1.defense > eff[1] ||
                            opponentUnitSlot2 && opponentUnitSlot2.defense > eff[2] ||
                            opponentUnitSlot3 && opponentUnitSlot3.defense > eff[3]){
                                played_spell = c;
                        }
                    }
                    if(eff[0] === 'destroyOpponentUnitsAboveDef'){
                        if(opponentUnitSlot1 && opponentUnitSlot1.defense > eff[1] ||
                            opponentUnitSlot2 && opponentUnitSlot2.defense > eff[2] ||
                            opponentUnitSlot3 && opponentUnitSlot3.defense > eff[3]){
                                played_spell = c;
                        }
                    }
                    if(eff[0] === 'destroyOpponentUnitsAboveAtt'){
                        if(opponentUnitSlot1 && opponentUnitSlot1.attack > eff[1] ||
                            opponentUnitSlot2 && opponentUnitSlot2.attack > eff[2] ||
                            opponentUnitSlot3 && opponentUnitSlot3.attack > eff[3]){
                                played_spell = c;
                        }
                    }
                })
    
                //Sets spell played if found one
                if(played_spell) playSpell(played_spell)
            }
        }
            placementStepFour(orgHand)
    }

    const placementStepFour = (orgHand) => {
        let evolvedUnits = orgHand.evolvedUnits
        if(evolvedUnits.length > 0){
            let played_unit = null;
            let slot = null;
            //iterates through all evolutions in hand
            evolvedUnits.forEach(card => {
                let c = card.card_type;
    
                //Checks to see if each player unit slot has the prevolution needed to play this card.
                //Then compares against previously found possibilities to play the stronger card.
                if(playerUnitSlot1 && playerUnitSlot1.name === c.evolution_name){
                    if(played_unit){
                        if((played_unit.card_type.attack < c.attack) || (played_unit && played_unit.card_type.defense < c.defense)){
                            played_unit = card;
                            slot = 1;
                        }
                    }else{
                        played_unit = card;
                    }
                }else if(playerUnitSlot2 && playerUnitSlot2.name === c.evolution_name){
                    if(played_unit){
                        if((played_unit.card_type.attack < c.attack) || (played_unit && played_unit.card_type.defense < c.defense)){
                            played_unit = card;
                            slot = 2;
                        }
                    }else{
                        played_unit = card;
                    }
                }else if(playerUnitSlot3 && playerUnitSlot3.name === c.evolution_name){
                    if(played_unit){
                        if((played_unit.card_type.attack < c.attack) || (played_unit && played_unit.card_type.defense < c.defense)){
                            played_unit = card;
                            slot = 3;
                        }
                    }else{
                        played_unit = card;
                    }
                }
            })
    
            //Places unit
            if(played_unit){
                removeFromHand(played_unit);
                //Sends info to backend
                socket.emit('place_unit', {
                    room_id:room_id,
                    user_id: user.id,
                    hand_size: (hand.length),
                    card_type: played_unit.card_type,
                    unit_slot: slot,
                    log: `${user.username} places ${played_unit.name}`
                })
                //Activate next placement phase step after waiting                   
                let waitAmt = 500 * rng(5)
                    // setTimeout(() => {
                        placementStepSix(orgHand);
                    // }, waitAmt)
            }else{
                placementStepFive(orgHand)
            }
        }else {
            placementStepFive(orgHand)
        }
    }

    const placementStepFive = (orgHand) => {
        let basicUnits = orgHand.basicUnits
        console.log('Thinking about placing basic unit')
        if(basicUnits.length > 0){
            let played_unit = null;
            let slot = null;
            basicUnits.forEach(card => {
                if(!playerUnitSlot1 || !playerUnitSlot2 || !playerUnitSlot3){
                    if(!playerUnitSlot2){
                        if(played_unit){
                            if((played_unit.card_type.attack < card.card_type.attack || played_unit.card_type.defense < card.card_type.defense)){
                                played_unit = card;
                                slot = 2;
                            }
                        }else {
                            played_unit = card;
                            slot = 2;
                        }
                    }
                    if(!playerUnitSlot1){
                        if(played_unit){
                            if((played_unit.card_type.attack < card.card_type.attack || played_unit.card_type.defense < card.card_type.defense)){
                                played_unit = card;
                                slot = 1;
                            }
                        }else {
                            played_unit = card;
                            slot = 1;
                        }
                    }
                    if(!playerUnitSlot3){
                        if(played_unit){
                            if((played_unit.card_type.attack < card.card_type.attack || played_unit.card_type.defense < card.card_type.defense)){
                                played_unit = card;
                                slot = 3;
                            }
                        }else {
                            played_unit = card;
                            slot = 3;
                        }
                    }
                }
            })

            if(played_unit) {
                removeFromHand(played_unit)
                //Sends info to backend
                socket.emit('place_unit', {
                    room_id:room_id,
                    user_id: user.id,
                    hand_size: hand.length,
                    card_type: played_unit.card_type,
                    unit_slot: slot,
                    log: `${user.username} places ${played_unit.card_type.name}`
                })
            }
            placementStepSix(orgHand);
        }else {
            placementStepSix(orgHand);
        }
    }

    const placementStepSix = (orgHand) => {
        let powerUp = orgHand.powerUp
        if(powerUp.length > 0) {
            let used_spell = null;
            powerUp.forEach(card => {
                if(playerUnitSlot1 || playerUnitSlot2 || playerUnitSlot3){
                    if(used_spell){
                        let cardEffAmt = card.card_type.effect.split(':')[1]
                        let usEffAmt = used_spell.card_type.effect.split(':')[1]
                        if(cardEffAmt > usEffAmt) used_spell = card;
                    }else{
                        used_spell = card;
                    }
                }
            })
            if(used_spell){
                console.log("Attempting to use ", used_spell)
                playSpell(used_spell.card_type);

                //Activate next placement phase step after waiting                   
                let waitAmt = 500 * rng(5)
                // setTimeout(() => {
                    placementStepSeven(orgHand);
                // }, waitAmt)
            }else{
                placementStepSeven(orgHand);
            }
        }else {
            placementStepSeven(orgHand);
        }
    }

    const placementStepSeven = (orgHand) => {
        let powerDown = orgHand.powerDown
        if(powerDown.length > 0){
            let used_spell = null;
            powerDown.forEach(card => {
                if(opponentUnitSlot1 || opponentUnitSlot2 || opponentUnitSlot3){
                    if(used_spell){
                        let cardEffAmt = card.card_type.effect.split(':')[1]
                        let usEffAmt = used_spell.card_type.effect.split(':')[1]
                        if(cardEffAmt > usEffAmt) used_spell = card;
                    }else{
                        used_spell = card;
                    }
                }
            })
            if(used_spell){
                playSpell(used_spell.card_type);
            }
        }

        //Combat phase emitter
        //Rules prohibit combat on turn 1.  Ends turn if pressed on turn 1.
        if(turnNumber === 1){
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


    const placementLogicDrawSpell = (draw) => {
        let played_spell = draw.pop();
            removeFromHand(played_spell);
            // drawCardHandler(Number(played_spell.card_type.effect.split(':')[1]))
            playSpell(played_spell.card_type);
    }

    const playSpell = (card) => {
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
                    console.log(t)
                    t.attack = Number(t.attack) + Number(effAmt);
                    payload.pu1 = t;
                }

                if(playerUnitSlot2) {
                    let t = {...playerUnitSlot2}
                    console.log(t)
                    t.attack = Number(t.attack) + Number(effAmt);
                    payload.pu2 = t;
                }

                if(playerUnitSlot3) {
                    let t = {...playerUnitSlot3}
                    console.log(t)
                    t.attack = Number(t.attack) + Number(effAmt);
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
                    payload.pu1 = t;
                }

                if(playerUnitSlot2) {
                    let t = {...playerUnitSlot2}
                    t.defense += Number(effAmt);
                    payload.pu2 = t;
                }

                if(playerUnitSlot3) {
                    let t = {...playerUnitSlot3}
                    t.defense += Number(effAmt);
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
                payload.log = `${user.username} plays ${card.name}!  Decreases all ${gameData.opponent_name}'s units' attack by ${effAmt}`

                //Payload is a variable used that contains all necessary info
                socket.emit('use_spell', payload);
            break;
        }
    }

    const combatPhase = () => {

        //Unit Slot 1 attack handler
        if(playerUnitSlot1){
            let target = null;
            let result = null;
            let targetName = null;
            if(opponentUnitSlot1){
                let res = playerUnitSlot1.attack - opponentUnitSlot1.defense;
                if(res > 0){
                    if(!result || res > result){
                        result = res;
                        target = 1;
                        targetName = opponentUnitSlot1.name;
                    }
                }
            }
            if(opponentUnitSlot2){
                let res = playerUnitSlot1.attack - opponentUnitSlot2.defense;
                if(res > 0){
                    if(!result || res > result){
                        result = res;
                        target = 2;
                        targetName = opponentUnitSlot2.name;
                    }
                }
            }
            if(opponentUnitSlot3){
                let res = playerUnitSlot1.attack - opponentUnitSlot3.defense;
                if(res > 0){
                    if(!result || res > result){
                        result = res;
                        target = 3;
                        targetName = opponentUnitSlot3.name;
                    }
                }
            }

            if(!opponentUnitSlot1 && !opponentUnitSlot2 && !opponentUnitSlot3){
                target = 2;
                targetName = 'directly'
            }

            console.log("Slot1 check",target)
            if(target){
                if(target === 1 && targetName !== 'directly'){
                    opponentUnitSlot1 = null;
                }
                if(target === 2 && targetName !== 'directly'){
                    opponentUnitSlot2 = null;
                }
                if(target === 3 && targetName !== 'directly'){
                    opponentUnitSlot3 = null;
                }

                //Calculates health points and losses
                let userHealth = playerHealth
                let targetHealth = opponentHealth
                let loss = false;
                if(result > 0){
                    targetHealth -= result;
                }else{
                loss = true;
                userHealth += result;
            }

            let tie = false;
            if (result === 0){
                tie = true;
            }

            socket.emit("attack", {
                    room_id:room_id,
                    user_id:user.id,
                    attacker_slot:1,
                    defender_slot:target,
                    results:result,
                    user_health:userHealth,
                    target_health:targetHealth,
                    tie:tie,
                    loss:loss,
                    log: `${user.username} attacks ${targetName} with ${playerUnitSlot1.name}!`
                })
            }
        }

        //Unit Slot 2 attack handler
        if(playerUnitSlot2){
            let target = null;
            let result = null;
            let targetName = null;
            if(opponentUnitSlot1){
                let res = playerUnitSlot2.attack - opponentUnitSlot1.defense;
                if(res > 0){
                    if(!result || res > result){
                        result = res;
                        target = 1;
                        targetName = opponentUnitSlot1.name;
                    }
                }
            }
            if(opponentUnitSlot2){
                let res = playerUnitSlot2.attack - opponentUnitSlot2.defense;
                if(res > 0){
                    if(!result || res > result){
                        result = res;
                        target = 2;
                        targetName = opponentUnitSlot2.name;
                    }
                }
            }
            if(opponentUnitSlot3){
                let res = playerUnitSlot2.attack - opponentUnitSlot3.defense;
                if(res > 0){
                    if(!result || res > result){
                        result = res;
                        target = 3;
                        targetName = opponentUnitSlot3.name;
                    }
                }
            }

            if(!opponentUnitSlot1 && !opponentUnitSlot2 && !opponentUnitSlot3){
                target = 2;
                targetName = 'directly'
            }

            console.log("Slot2 check",target)
            if(target){
                if(target === 1 && targetName !== 'directly'){
                    opponentUnitSlot1 = null;
                }
                if(target === 2 && targetName !== 'directly'){
                    opponentUnitSlot2 = null;
                }
                if(target === 3 && targetName !== 'directly'){
                    opponentUnitSlot3 = null;
                }

                //Calculates health points and losses
                let userHealth = playerHealth
                let targetHealth = opponentHealth
                let loss = false;
                if(result > 0){
                    targetHealth -= result;
                }else{
                    loss = true;
                    userHealth += result;
                }
    
                let tie = false;
                if (result === 0){
                    tie = true;
                }
    
                socket.emit("attack", {
                        room_id:room_id,
                        user_id:user.id,
                        attacker_slot:2,
                        defender_slot:target,
                        results:result,
                        user_health:userHealth,
                        target_health:targetHealth,
                        tie:tie,
                        loss:loss,
                        log: `${user.username} attacks ${targetName} with ${playerUnitSlot2.name}!`
                })
            }
        }


        //Unit Slot 3 attack handler
        if(playerUnitSlot3){
            let target = null;
            let result = null;
            let targetName = null;
            if(opponentUnitSlot1){
                let res = playerUnitSlot3.attack - opponentUnitSlot1.defense;
                if(res > 0){
                    if(!result || res > result){
                        result = res;
                        target = 1;
                        targetName = opponentUnitSlot1.name;
                    }
                }
            }
            if(opponentUnitSlot2){
                let res = playerUnitSlot3.attack - opponentUnitSlot2.defense;
                if(res > 0){
                    if(!result || res > result){
                        result = res;
                        target = 2;
                        targetName = opponentUnitSlot2.name;
                    }
                }
            }
            if(opponentUnitSlot3){
                let res = playerUnitSlot3.attack - opponentUnitSlot3.defense;
                if(res > 0){
                    if(!result || res > result){
                        result = res;
                        target = 3;
                        targetName = opponentUnitSlot3.name;
                    }
                }
            }

            if(!opponentUnitSlot1 && !opponentUnitSlot2 && !opponentUnitSlot3){
                target = 2;
                targetName = 'directly'
            }

            console.log("Slot3 check",target)
            if(target){
                if(target === 1 && targetName !== 'directly'){
                    opponentUnitSlot1 = null;
                }
                if(target === 2 && targetName !== 'directly'){
                    opponentUnitSlot2 = null;
                }
                if(target === 3 && targetName !== 'directly'){
                    opponentUnitSlot3 = null;
                }

                //Calculates health points and losses
                let userHealth = playerHealth
                let targetHealth = opponentHealth
                let loss = false;
                if(result > 0){
                    targetHealth -= result;
                }else{
                    loss = true;
                    userHealth += result;
                }
    
                let tie = false;
                if (result === 0){
                    tie = true;
                }
    
                socket.emit("attack", {
                        room_id:room_id,
                        user_id:user.id,
                        attacker_slot:3,
                        defender_slot:target,
                        results:result,
                        user_health:userHealth,
                        target_health:targetHealth,
                        tie:tie,
                        loss:loss,
                        log: `${user.username} attacks ${targetName} with ${playerUnitSlot3.name}!`
                })
            }
        }

        socket.emit('end_turn', {
            room_id: room_id,
            user_id: user.id,
            turn_number: turnNumber,
            log: `${user.username} ends their turn.`
        })
    }
    
    
    return (
        <div style={{display:'none'}}>
            <h1>Hello from the AI</h1>
        </div>
    )
}


export default AI;