import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import io from "socket.io-client";
import GameBoard from '../GameBoard';
import {getUserDecks} from '../../services/deck';

const endPoint = "http://localhost:5000"
const socket = io(endPoint);

const MatchmakingLobby = () => {
    const user = useSelector(state => state.session.user);
    const [decks, setDecks] = useState(null);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [gameFound, setGameFound] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [gameData, setGameData] = useState(null);
    const [gameLost, setGameLost] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    useEffect(() => {    
    (async () => {
        const d = await getUserDecks(user.id);
        console.log(d.decks)
        console.log(d.decks[0])
        setDecks(d.decks)
        setSelectedDeck(d.decks[0])
    })()
    socket.on("waiting_for_game", data => {
        console.log('waiting for game fired')
        setWaiting(true)
    }, [])
    
    socket.on("setup_game", data => {
        const gd = {
            room_id:data.room_id,
            turn_order:data.turn_order,
        }
        if(data.room_id === user.id){
            gd.opponent_name = data.guest_username
        }else {
            gd.opponent_name = data.host_username
        }
        setGameData(gd)
        setGameFound(true)
    })

    socket.on("game_ended", data => {
        if(data.loser_id === user.id){
            setGameLost(true);
        }else{
            setGameWon(true);
        }
    })
    }, [])

    const findGame = () => {
        socket.emit('find_game', {
        user_id: user.id,
        username: user.username,
    })
}


    return (
        <div>
            {gameLost && (
                <div>
                    <h1>GAME OVER</h1>
                    <h3>YOU LOST</h3>
                    <button onClick={findGame}>Try Again...</button>
                </div>
            )}
            {gameWon && (
                <div>
                    <h1>CONGRATULATIONS</h1>
                    <h3>YOU WON!!!!</h3>
                    <button onClick={findGame}>Play Again...</button>
                </div>
            )}
            {!gameLost && !gameWon && gameFound && gameData && (
                <GameBoard socket={socket} gameData={gameData} playerdeck={selectedDeck.cards} />
            )}
            {!gameLost && !gameWon && !gameFound && !waiting && decks &&
                (<div>
                    <select
                        value={selectedDeck}
                        onChange={(e) => setSelectedDeck(decks[e.target.value])}
                        >
                            {console.log(selectedDeck)}
                            {decks.map((deck, i) => <option key={deck.id} value={i}>{deck.id}</option>)}
                    </select>
                    <button onClick={findGame} disabled={!selectedDeck}>Find Game...</button>
                </div>)}
            {!gameLost && !gameWon && !gameFound && waiting && 
                (<div>
                    <h1>Waiting for game...</h1>
                </div>)}
        </div>
    )
}

export default MatchmakingLobby;