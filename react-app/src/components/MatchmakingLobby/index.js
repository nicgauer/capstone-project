import React, {useEffect, useState} from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import io from "socket.io-client";
import GameBoard from '../GameBoard';
import {getUserDecks} from '../../services/deck';
import {addWin, addLoss} from '../../store/session'
import RulesPage from './rules';
import AI from '../AI';
import Navigation from '../Navigation';
import VictoryDisplay from './VictoryDisplay'
import DefeatDisplay from './DefeatDisplay'

import styles from './MatchmakingLobby.module.css';

const endPoint = "http://localhost:5000"
// const endPoint = "https://super-battle-cards.herokuapp.com"
const socket = io(endPoint);

const MatchmakingLobby = () => {
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [decks, setDecks] = useState(null);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [gameFound, setGameFound] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [gameData, setGameData] = useState(null);
    const [gameLost, setGameLost] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [AIgame, setAIgame] = useState(false);

    useEffect(() => {    
    (async () => {
        const d = await getUserDecks(user.id);
        // console.log(d.decks)
        // console.log(d.decks[0])
        setDecks(d.decks)
        setSelectedDeck(d.decks[0])
    })()
    socket.on("waiting_for_game", data => {
        // console.log('waiting for game fired')
        setWaiting(true)
    })
    
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

    socket.on("game_ended", async data => {
        setAIgame(false);
        socket.emit("room_leave", {
            user_id: user.id,
            room_id: data.room_id
        })
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

    const playAIgame = () => {
        socket.emit("ai_game", {
            user_id: user.id,
        })
        let turnOrder = [0, user.id]
        const roll = rng(10)
        if(roll % 2 === 0){
            turnOrder = [user.id, 0]
        }
        const gd = {
            room_id:user.id,
            turn_order:turnOrder,
            opponent_name: 'Duel Bot'
        }
        setGameData(gd)
        setAIgame(true);
    }

    const rng = (max) => {
        return Math.floor(Math.random() * max);
    }

    const reloadHandler = () => {
        window.location.reload();
    }


    return (
        <div>
            {!(AIgame && !gameLost && !gameWon && gameData) && !(!AIgame && !gameLost && !gameWon && gameFound && gameData) && <Navigation currentLocation={'home'} />}
            {gameLost && (
                <DefeatDisplay />
            )}
            {gameWon && (<VictoryDisplay /> )}

            {AIgame && !gameLost && !gameWon && gameData && (
                <GameBoard socket={socket} gameData={gameData} playerdeck={selectedDeck.cards} />
                )}

            {AIgame && !gameLost && !gameWon && gameData && (
                <AI socket={socket} gameData={gameData} AIdeck={selectedDeck.cards} />
                )}

            {!AIgame && !gameLost && !gameWon && gameFound && gameData && (
                <GameBoard socket={socket} gameData={gameData} playerdeck={selectedDeck.cards} />
            )}
            {!AIgame && !gameLost && !gameWon && !gameFound && !waiting && decks &&
                (<div className={styles.mainWrapper}>
                    
                    <RulesPage />

                    <div className={styles.deckSelectorContainer}>
                        <h1>CHOOSE YOUR DECK</h1>
                        <select
                            value={selectedDeck}
                            onChange={(e) => setSelectedDeck(decks[e.target.value])}
                            >
                                {console.log(decks)}
                                {decks.map((deck, i) => <option key={deck.id} value={i}>{deck.name}</option>)}
                        </select>
                    </div>

                    <div className={styles.mainButtonContainer}>
                        <button className={styles.mmButton} onClick={findGame} disabled={!selectedDeck}>Multiplayer</button>

                        <button className={styles.mmButton} onClick={playAIgame} disabled={!selectedDeck}>Single Player</button>
                    </div>
                </div>)}
            {!gameLost && !gameWon && !gameFound && waiting && 
                (<div>
                    <h1>Waiting for game...</h1>
                </div>)}
        </div>
    )
}

export default MatchmakingLobby;