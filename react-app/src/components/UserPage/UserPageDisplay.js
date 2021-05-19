import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import styles from './UserPageDisplay.module.css';


const UserPageDisplay = ({ user }) => {
    const loggedInUser = useSelector((state) => state.session.user);

    return (
        <div>
            <div>
                <h1>{user.username}</h1>
                <h2>W - {user.wins}</h2>
                <h2>L - {user.losses}</h2>
            </div>
        </div>
    )
}

export default UserPageDisplay