# WEBSOCKET PLANNING

## Matchmaking 
    emit 'join_room' when hosting/joining room.  Room name is host user id.

    emit 'game_start' from host front end when opponent joins.

## Game Start
    emit 'setup_game' from backend with turn order, each user obj of player to each client 

>a note on turn phases -- each turn phase will be a boolean state value, activating the buttons for player who's turn it is.

## Draw Phase
    emit 'draw_phase' from client to draw card.  Player hands are only stored on front end, so 'draw_phase' json will be only playerid and number of cards.  
    
    Backend will emit 'player_draw' to both clients to update player hand change and the progression to placement phase.

## Placement phase
    emit 'place_unit' from client when unit placement is confirmed by user.  Front end limits the 1 unit placement per turn rule.  Backend emits 'unit_placed' to both clients.  Request includes -- card obj, unit slot, controlled player.

    emit 'place_trap' from client when trap card placement is confirmed by user.  Front end limits the 1 trap placement per turn rule.  Backend emits 'trap_placed' to both clients.  Request includes -- card obj, trap slot, controlled player.

    emit 'use_spell' from client when spell card use is confirmed by user.  Front end will send str(effect:amount) to back end, backend will emit 'spell_used' to both clients.  Upon 'spell_used,' client will parse and apply effect:amount to target monster/player.

## Combat phase
    emit activate_trap from client when placed trap card is activated.  Players can activate traps during any combat phase, including opponents.  backend 'trap_activated' to update clients.

    emit 'attack' from client when attack is confirmed by player.  Attack results are calculated by client and sent to back end.  backend emits 'attack_occurred' and updates users.  Attack object includes attacking monster, losing monster, and player health changes.  Will also update state to remove dead monsters and add them to discard pile state.

## End turn
    emit 'end_turn' from user when no monsters are able to fight, or when user clicks 'end turn' button.  Back end emits 'turn_ended' to players.