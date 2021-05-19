import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {addWin} from '../../store/session'
import { NavLink } from 'react-router-dom';

import styles from './MatchmakingLobby.module.css'


const VictoryDisplay = ({ opponentId }) => {
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    const reloadHandler = () => {
        window.location.reload();
    }


    useEffect(() => {
        (async () => await dispatch(addWin(user.id)))();
    }, [])

    return (
        <div className={styles.victoryDisplayWrapper}>
                    <h1>CONGRATULATIONS</h1>
                    <h3>YOU WON!!!!</h3>
                    <p>$100 gained!</p>
                    
                    <div className={styles.mainButtonContainer}>
                        <button onClick={reloadHandler} className={styles.mmButton}>
                            Play Again
                        </button>
                        <NavLink to='/store'>
                            <button className={styles.mmButton}>
                                Card Store
                            </button>
                        </NavLink>
                        <NavLink to='/collection'>
                            <button className={styles.mmButton}>
                                Card Collection
                            </button>
                        </NavLink>
                    </div>
                    {opponentId && (
                        <div>
                            <NavLink to={`/users/${opponentId}`}>
                                View Opponent Information
                            </NavLink>
                        </div>
                    )}
                </div>
    )
}

export default VictoryDisplay;