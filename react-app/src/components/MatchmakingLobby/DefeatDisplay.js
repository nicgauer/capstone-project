import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {addLoss} from '../../store/session';
import styles from './MatchmakingLobby.module.css'
import { NavLink } from 'react-router-dom';

const DefeatDisplay = () => {
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    const reloadHandler = () => {
        window.location.reload();
    }


    useEffect(() => {
        (async () => await dispatch(addLoss(user.id)))();
    }, [])


    return (
        <div className={styles.defeatDisplayWrapper}>
                    <h1>GAME OVER</h1>
                    <h3>YOU LOST</h3>
                    <p>$50 gained!</p>

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
                </div>
    )
}

export default DefeatDisplay;