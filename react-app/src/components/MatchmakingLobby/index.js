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
    const [gameData, setGameData] = useState(null);
    
    const findGame = () => {
        socket.emit('find_game', {
            user_id: user.id,
            username: user.username,
        })
    }

    socket.on("waiting_for_game", data => {
        console.log('waiting for game fired')
        setWaiting(true)
    })

    socket.on("setup_game", data => {
        const gd = {
            room_id:data.room_id,
            turn_order:data.turn_order
        }
        if(data.room_id === user.id){
            gd.opponent_name = data.guest_username
        }else {
            gd.opponent_name = data.host_username
        }
        setGameData(gd)
        setGameFound(true)
    })

    return (
        <div>
            {gameFound && gameData && (
                <GameBoard socket={socket} gameData={gameData} />
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