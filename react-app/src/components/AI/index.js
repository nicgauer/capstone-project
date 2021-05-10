import React, {useEffect} from 'react';


const AI = ({socket, gameData, AIdeck}) => {
    const room_id = gameData.room_id;
    const turnOrder = gameData.turn_order;
    const user = {
        name:'AI',
        id:'0'
    }
    let turnNumber = 1;
    let playerHealth = 1000;
    let opponentHealth = 1000;

    // let drawPhase = false;
    // let placementPhase = false;
    // let combatPhase = false;

    let hand = [];
    let deck = [...AIdeck];

    let playerUnitSlot1 = null;
    let playerUnitSlot2 = null;
    let playerUnitSlot3 = null;

    let opponentUnitSlot1 = null;
    let opponentUnitSlot2 = null;
    let opponentUnitSlot3 = null;

    // ----- HELPERS ----- \\

    const rng = (max) => {
        return Math.floor(Math.random() * max);
    }

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

    const removeFromHand = (card) => {
        let h = [...hand]
        setHand(h.filter(c => c.id != card.id));
    }


    useEffect(() => {
        deck = shuffle(deck);
        hand = drawHand(deck);

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
                //if AI's turn, activate draw phase flag
                drawPhase()
            }
            //Updates both users' turn count
            turnNumber = data.turn_number;
        })

        socket.on("card_drawn", data => {
            //If AI drew card
            if(data.user_id === user.id) {
                let waitAmt = 500 * rng(5)
                setTimeout(() => {
                    //Tells backed this client is starting next phase
                    socket.emit("start_placement_phase", {
                        user_id: user.id,
                        room_id: room_id,
                    })
                }, waitAmt)
            }
        })

        //Spell Used updates both clients when a spell is used
        socket.on("spell_used", data => {
            //if this client used spell
            if(data.user_id === user.id){

                //Updates opponent health if changes
                if(data.opp_health) opponentHealth = data.opp_health;

                //updates user health if changes
                if(data.user_health) {
                    //ends game of spell kills client
                    if(data.user_health < 0) {
                        socket.emit('end_game', {
                            loser_id:user.id,
                            room_id:room_id,
                        })
                    }
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
                    playerHealth = data.opp_health;
                }

                //updates user health if changes
                if(data.user_health) setOpponentHealth(data.user_health)

                //Handles destruction effects
                if(data.destroy) {
                    if(data.destroy.includes(1)) {
                        playerUnitSlot1 = null
                    }
                    if(data.destroy.includes(2)) {
                        playerUnitSlot2 = null
                    }
                    if(data.destroy.includes(3)) {
                        playerUnitSlot3 = null
                    }
                }

                //Handle stat changes
                if(data.pu1) opponentUnitSlot1 = data.pu1
                if(data.pu2) opponentUnitSlot2 = data.pu2
                if(data.pu3) opponentUnitSlot3 = data.pu3
                if(data.ou1) playerUnitSlot1 = data.ou1
                if(data.ou2) playerUnitSlot2 = data.ou2
                if(data.ou3) playerUnitSlot3 = data.ou3
            }
        })

        // ---------- PLACEMENT PHASE ---------- \\

        socket.on("placement_phase_start", data => {
            //If this user is starting placement phase
            if(data.user_id === user.id) {
                //Activate placement phase
                placementPhase()
            }
        })

    }, [])


    // ---------- DRAW PHASE ---------- \\

    const drawPhase = () => {
        if(deck.length > 0){
            //Draws card from deck and adds it to hand
            hand.push(deck.pop())

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

    const drawCardHandler = (num) => {
        if(deck.length > 0){
            for (let i = 0; i < num; i++) {
                hand.push(deck.pop())
            }
        }
    }

    // ---------- PLACEMENT PHASE ---------- \\

    const placementPhase = () => {
        //spells
        let draw = [];
        let health = [];
        let destroy = [];
        let powerUp = [];
        let powerDown = [];
        
        //units
        let basicUnits = [];
        let evolvedUnits = [];
        
        //Hand sorting
        deck.forEach(card => {
            if(card.card_type.type === 'unit'){
                if(card.card_type.evolution_name){
                    evolvedUnits.push(card);
                }else {
                    basicUnits.push(card);
                }
            }else{
                let eff = card.card_type.effect.split(':')[0]
                if(eff === 'heal'){
                    health.push(card);
                }
                if(eff === 'damage'){
                    health.push(card);
                }
                if(eff === 'draw'){
                    draw.push(card);
                }
                if(eff === 'destroyOpponentUnitsBelowDef' || eff === 'destroyOpponentUnitsBelowAtt' || eff === 'destroyOpponentUnitsAboveDef' || eff === 'destroyOpponentUnitsAboveAtt'){
                    destroy.push(card);
                }
                if(eff === 'increaseAllAttack' || eff === 'increaseAllDefense'){
                    powerUp.push(card);
                }
                if(eff === 'decreaseAllAttack' || eff === 'decreaseAllDefense') {
                    powerDown.push(card);
                }
            }
        })

        //If hand contains a draw type card, plays one
        if(draw.length > 0){
            let played_spell = draw.pop();
            removeFromHand(played_spell);
            drawCardHandler(Number(played_spell.card_type.effect.split(':')[1]))
            playSpell(played_spell.card_type);
        }

        //If hand contains a healing or damage spell, plays one 
        if(health.length > 0){
            let played_spell = health.pop();
            removeFromHand(played_spell);
            playSpell(played_spell.card_type);
        }

        //If hand contains a monster destruction spell, plays one only if opponent has a unit that would be affected
        if(destroy.length > 0){

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

        let unitPlaced = false;
        //Checks evolved units first
        if(evolvedUnits.length > 0) {
            let played_unit = null;
            //iterates through all evolutions in hand
            evolvedUnits.forEach(card => {
                let c = card.card_type;

                //Checks to see if each player unit slot has the prevolution needed to play this card.
                //Then compares against previously found possibilities to play the stronger card.
                if(playerUnitSlot1 && playerUnitSlot1.name === c.evolution_name){
                    if((played_unit && played_unit.attack < c.attack) || (played_unit && played_unit.defense < c.defense)){
                        played_unit = c;
                    }
                }else if(playerUnitSlot2 && playerUnitSlot2.name === c.evolution_name){
                    if((played_unit && played_unit.attack < c.attack) || (played_unit && played_unit.defense < c.defense)){
                        played_unit = c;
                    }
                }else if(playerUnitSlot3 && playerUnitSlot3.name === c.evolution_name){
                    if((played_unit && played_unit.attack < c.attack) || (played_unit && played_unit.defense < c.defense)){
                        played_unit = c;
                    }
                }
            })

            //Places unit
            unitPlaced = true;
        }

    }


    const placementLogicDrawSpell = (draw) => {
        let played_spell = draw.pop();
            removeFromHand(played_spell);
            drawCardHandler(Number(played_spell.card_type.effect.split(':')[1]))
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
    }


    return (
        <div style={{display:'none'}}>
            <h1>Hello from the AI</h1>
        </div>
    )
}