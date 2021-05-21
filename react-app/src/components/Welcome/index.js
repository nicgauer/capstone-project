import React from 'react';
import {NavLink} from 'react-router-dom'

const Welcome = () => {
    return (
        <div>
            <h1>Welcome to Super Battle Cards!!</h1>
            <p>Thanks for signing up for an account!</p>
            <p>Super Battle Cards is a unique trading card game.  In order to play, you'll need cards!!</p>
            <p>Head to the <NavLink to='/store'>card store</NavLink> to buy some booster packs!</p>
            <p>Don't forget to add them to your deck in the <NavLink to='/'>card collection</NavLink> when you're done!</p>
        </div>
    )
}

export default Welcome;