import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import io from "socket.io-client";
import GameBoard from '../GameBoard';

const endPoint = "http://localhost:5000"
const socket = io(endPoint);

const MatchmakingLobby = () => {
    const user = useSelector(state => state.session.user);
    const [gameFound, setGameFound] = useState(false);
    const [waiting, setWaiting] = useState(false);
    
    const findGame = () => {
        socket.emit('find_game', {
            user_id: user.id
        })
    }

    socket.on("waiting_for_game", data => {
        console.log('waiting for game fired')
        setWaiting(true)
    })

    socket.on("setup_game", data => {
        console.log('setup game fired')
        setGameFound(true)
    })

    return (
        <div>
            {gameFound && (
                <GameBoard socket={socket} />
            )}
            {!gameFound && !waiting && 
                (<div>
                    <button onClick={findGame}>Find Game...</button>
                </div>)}
            {!gameFound && waiting && 
                (<div>
                    <h1>Waiting for game...</h1>
                </div>)}
        </div>
    )
}

export default MatchmakingLobby;