import React, {useEffect, useState} from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import io from "socket.io-client";
import GameBoard from '../GameBoard';
import {getUserDecks} from '../../services/deck';
import {getFriends} from '../../services/friendship';
// import {addWin, addLoss} from '../../store/session'
import RulesPage from './rules';
import AI from '../AI';
import Navigation from '../Navigation';
import VictoryDisplay from './VictoryDisplay';
import DefeatDisplay from './DefeatDisplay';
import { Modal } from '../../context/Modal';

import styles from './MatchmakingLobby.module.css';

const endPoint = "http://localhost:5000"
// const endPoint = "https://super-battle-cards.herokuapp.com"
const socket = io(endPoint);

const MatchmakingLobby = () => {
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [decks, setDecks] = useState(null);
    const [aiDecks, setAiDecks] = useState(null);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [selectedDeckDisplay, setSelectedDeckDisplay] = useState(null);
    const [gameFound, setGameFound] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [gameData, setGameData] = useState(null);
    const [gameLost, setGameLost] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [AIgame, setAIgame] = useState(false);
    const [opponentId, setOpponentId] = useState(null);
    const [friends, setFriends] = useState([]);
    const [invites, setInvites] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [friendsModal, setFriendsModal] = useState(false);

    useEffect(() => {    
    (async () => {
        const ad = await getUserDecks(1);
        const d = await getUserDecks(user.id);
        const f = await getFriends(user.id);
        
        // console.log(d.decks)
        // console.log(d.decks[0])
        setDecks(d.decks)
        setSelectedDeck(d.decks[0])
        setSelectedDeckDisplay(d.decks[0].name)
        setAiDecks(ad.decks);
        setFriends(f.friends.map(fr => {
            if(fr.user1.id === user.id){
                return fr.user2
            }else {
                return fr.user1
            }
        }))
    })()

    cancelFindGame();

    socket.emit("online", {
        user_id: user.id,
    })

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
        if(data.turn_order[0] === user.id){
            setOpponentId(data.turn_order[1])
        }else{
            setOpponentId(data.turn_order[0])
        }
        setGameData(gd)
        setGameFound(true)
        socket.emit("ingame", {
            user_id: user.id,
        })
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

    socket.on("found_games", data => {
        if(data.invites){
            setInvites(data.invites);
        }
    })

    checkForInvites();

    return () => {
        cancelFindGame();
        socket.removeAllListeners();
    }

    }, [])

    const findGame = () => {
        socket.emit('find_game', {
            user_id: user.id,
            username: user.username,
        })
    }

    const cancelFindGame = () => {
        socket.emit("cancel_matchmaking", {
            user_id: user.id
        })
    }

    const matchmakingCancel = () => {
        cancelFindGame();
        setWaiting(false);
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
            room_id:`${user.id}ai`,
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

    const selectedDeckHandler = (e) => {
        console.log(e)
        // console.log(decks)
        let d = decks.find(deck => deck.id === Number(e))
        setSelectedDeckDisplay(d.name)
        console.log(d.name)
        setSelectedDeck(d)
    }

    const checkForInvites = () => {
        socket.emit("check_for_invites", {
            user_id:user.id
        })
    }

    const inviteToGame = (targetId) => {
        let friend = friends.find(friend => friend.id === targetId);
        socket.emit("invite_to_game", {
            user_id:user.id,
            username:user.username,
            target_id:targetId,
            target_name:friend.username,
        })
    }

    const acceptInvite = (targetId) => {
        let friend = friends.find(friend => friend.id === targetId);
        socket.emit("accept_invite", {
            user_id:user.id,
            username:user.username,
            host_id:targetId,
            host_name:friend.username,
        })
    }

    const friendsHandler = () => {
        checkForInvites();
        setFriendsModal(true);
    }


    return (
        <div>
            {!(AIgame && !gameLost && !gameWon && gameData) && !(!AIgame && !gameLost && !gameWon && gameFound && gameData) && <Navigation currentLocation={'home'} />}
            {gameLost && (<DefeatDisplay opponentId={opponentId} />)}
            {gameWon && (<VictoryDisplay opponentId={opponentId} /> )}

            {AIgame && !gameLost && !gameWon && gameData && (
                <GameBoard socket={socket} gameData={gameData} playerdeck={selectedDeck.cards} />
                )}

            {AIgame && !gameLost && !gameWon && gameData && (
                <AI socket={socket} gameData={gameData} AIdeck={aiDecks[rng(aiDecks.length - 1)].cards} />
                )}

            {!AIgame && !gameLost && !gameWon && gameFound && gameData && (
                <GameBoard socket={socket} gameData={gameData} playerdeck={selectedDeck.cards} />
            )}
            {!AIgame && !gameLost && !gameWon && !gameFound && !waiting && decks &&
                (<div className={styles.mainWrapper}>
                    
                    <button className={styles.rulesButton} onClick={() => setShowModal(true)}>Read Rules</button>

                    {showModal && (<Modal onClose={() => setShowModal(false)}>
                            <RulesPage />
                        </Modal>
                    )}

                    <div className={styles.deckSelectorContainer}>
                        {/* <h1>CHOOSE YOUR DECK</h1> */}
                        {selectedDeck && (
                            <div>
                                <h3>Current Deck -- {selectedDeck.name}</h3>
                                <h4>Deck Size -- {selectedDeck.cards.length}</h4>
                                {selectedDeck.cards.length < 10 && (
                                    <div>
                                        <h1>
                                            <span style={{'color':'red'}}>WARNING -</span> Deck must have at least 10 cards.
                                        </h1>

                                        <div className={styles.linkContainer}>
                                            <NavLink to="/collection">
                                                <button className={styles.mmButton}>Add More Cards</button>
                                            </NavLink>
                                        </div>
                                    </div>
                                )}
                                <div className={styles.linkContainer}>
                                    <NavLink to="/collection">
                                        Edit Deck
                                    </NavLink>
                                </div>
                            </div>
                            
                            )}
                        {/* <select
                            value={selectedDeckDisplay}
                            onChange={(e) => selectedDeckHandler(e.target.value)}
                            >
                                {console.log(selectedDeck)}
                                {decks.map((deck, i) => <option key={deck.id} value={deck.id}>{deck.name}</option>)}
                        </select> */}
                    </div>

                    {(selectedDeck && selectedDeck.cards.length >= 10) && (
                        <div className={styles.mainButtonContainer}>
                        <button className={styles.mmButton} onClick={findGame}>Random Multiplayer</button>

                        <button className={styles.mmButton} onClick={playAIgame}>Play Against AI</button>

                        <button className={styles.mmButton} onClick={friendsHandler}>Play With Friends</button>
                    </div>
                    )}

                    {friendsModal && <Modal onClose={() => setFriendsModal(false)}>
                        <div className={styles.friendsListModal}>

                            <div className={styles.friendsListTitle}>
                                <h1>Friends List</h1>
                                <button className={styles.refreshButton} onClick={checkForInvites}>refresh</button>
                            </div>

                            {friends.length > 0 && (
                                friends.map(friend => 
                                    <div className={styles.friendDisplay}>
                                        <div className={styles.friendInfo}>
                                            <h1>{friend.username}</h1>
                                            <h2 className={styles.status}>
                                            <div className={friend.status === 'online' ? styles.online :
                                                            friend.status === 'in game' || friend.status === 'in AI game' ? styles.ingame : styles.offline} />
                                                {friend.status}
                                            </h2>
                                        </div>
                                        {!invites.includes(friend.id) && <button className={styles.mmButton} onClick={() => inviteToGame(friend.id)}>Invite to Game</button>}
                                        {invites.includes(friend.id) && <button className={styles.mmButton} onClick={() => acceptInvite(friend.id)}>Accept Invite</button>}
                                    </div>
                                )
                                )}
                        </div>
                    </Modal>}
                </div>)}
            {!gameLost && !gameWon && !gameFound && waiting && 
                (<div className={styles.mainWrapper}>
                    <h1>Waiting for game...</h1>
                    <button className={styles.cancelButton} onClick={matchmakingCancel}>Cancel</button>
                </div>)}
        </div>
    )
}

export default MatchmakingLobby;