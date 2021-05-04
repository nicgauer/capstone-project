# GAME LOGIC MOCKUP

The frontend is the gameboard.  It keeps track of the cards in play, the player's decks, the players health, discard pile, and hands.  The backend acts as a bridge to keep both players' boards updated to be the same using flask-socket.io custom event handlers and react useEffect/useState.

The gameboard is comprised of 6 card slots for each player.  3 unit slots, 3 trap slots.  Trap slots are always placed face down, while units can be placed face up or down.  Trap cards can only be activated in combat phase, and are usually power up or down for specific monsters.  Each deck will be limited to 20 monsters, 10 spells, 10 traps.

Each card slot is handled by a useEffect and useState.  Each useEffect is linked to a socket.io listenter.  Both players' screens will be updated each time an update happens.

Each player starts with health points, and whoever loses them all first is the loser.  Health is lost in combat between unit cards, and also through spell and trap cards.

## MATCHMAKING
    Matchmaking will be a simple host/join design for phase 1.  If you want to play, you can host a game for someone to join, or you can join a game that someone else has hosted.  There will be a simple matchmaking screen with available games listed.

## ON GAME START
<li> load active deck (to_dict on each card)
>likely a store, opponent never recieves players deck

<li> shuffle active deck 
<li> Send user obj and deck obj to namespace 
<li> Set and broadcast turn order <br />
> turn order will be set by the back end and broadcasted to each player, where it will be saved in a state and updated.

<li> set each player's hp to 3000
<li> front end populates hand state

## TURN LOOP
    Backend emits message to both clients who's turn it is.  Frontend for both players updates to display the beginning of player X's turn.

### Draw phase
    Draw button activates upon turn start.  When clicked, hand state is updated on front end.  Emit "draw" to back end with player id, turn number, and hand size.  Backend emits change to both players.  Use effects update both clients to above changes and the advancement to placement phase.

### Placement phase
    Players can place cards on field.  Limit one each unit unit and one trap card type placement per turn.  On each placement, emit "place_<unit or trap>" to backend with player id, turn number, face up/down status, card_zone_id and card obj that includes all relevant info.  Backend emits change to both players.  Use effects update both clients.

    Place card will have three steps for user.  Select card from hand, select card slot, select facedown/faceup status.  Each player has 3 slots for unit cards and 3 slots for trap cards.  Spell cards are always instant use.

    Spell card effects also usable in this phase.  Spell cards will contain strings with effect:amt(if applies).  If spell card is activated, emit "use_spell" with user_id.  Backend emits appropriate message to change.  possible (playerHPchange, powerUp, powerDown, draw_card) with player ID that effect will affect.  HP damage can occur here.  If HP falls below 0 on front end, emit 'endgame' to back end.

    Certain units can only be placed if a precursor units is already in place.  This will be called something in the final game but I don't know what yet.  This power up will be drastic, and can happen an unlimited amount per placement phase, so long as the player has the prerequisite card on the field and the evolution in hand.

    When complete, player can press button to enter combat phase.  Upon button press, frontend emits 'combatphasestart' message to backend.  Backend emits an update to both clients.

### Combat phase
    Cannot place cards in combat.  Can activate trap cards during combat.  Trap cards will be calculated the same as spell cards.

    Combat has three steps for user.  Select attacking card, select target, accept.  Upon accept, emit results obj to backend.  Backend emits updates both users' front ends on each fight.  HP damage will be updated here as well.  If target player HP falls below 0 in this phase, client will emit 'gameover' and relevant info obj to backend.

    Each unit has an attack value and a defense value.  When attacking, the unit uses its attack value.  When being attacked, it uses its defense value.  Whichever unit has a larger relevant stat wins, and the player suffers the difference in HP damage.  If no units are on the opponents field, they can attack directly.  Each unit can attack once per turn.

    If no units can attack, or the user clicks "end turn", front end emits "end turn" message to backend.  Message to backend will contain the current player, and the next player.

### END TURN PHASE
    Backed emits turn update to both players and starts new player's turn.

# PLAYER CAN PLAY AGAINST AI OR PLAYERS

If player chooses to play against the AI, or no human player can be found to play against, the code could basically run the same.  The AI could interact with the websockets from the backend.  Otherwise, the AI's deck and username could come from the backend, and brains could all be frontend to lighten the load on the servers.  Either way, AI will be RNG based and be very basic.

# END OF GAME 

    Each user that participated will receive currency for playing.  Winner will receive 150 while losers will receive 50.