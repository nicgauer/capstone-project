import React, {useState} from 'react';
import styles from './RulePage.module.css';

const RulesPage = () => {

    return (
        <div className={styles.rulesWrapper}>
            <h1 className={styles.rulesHeader}>Super Battle Cards Official Rules</h1>
            <div className={styles.rulesContainer}>
                <p>
                    Each player begins with the same amount of health points.  The goal of Super Battle Cards is to lower your opponent's health to zero.
                </p>
                <p>
                    Each turn has 3 parts - a draw phase, a placement phase, and a combat phase.
                </p>
                <p>On their draw phase, a player draws a card from their deck.  If there are no more cards to draw, they lose the game.</p>
                <p>The placement phase begins immediately when a player successfully draws a card.
                    Here, a player can place one unit card per turn, or play any number of spell cards.
                </p>
                <p>
                    The combat phase begins when the player ends their placement phase.
                    On turn 1, the combat phase is automatically skipped.
                </p>
                <p>
                    Combat is calculated by comparing the attacking unit's attack against the defending unit's defense.  Whichever is bigger wins, and the loser loses the difference in health points.
                </p>
                <p>
                    In result of a tie, both units are lost but no damage is taken by either player.
                </p>
                <p>
                    Certain units are "evolutions" of other units.  This means they can only be placed if their pre-evolution is on the field already.
                </p>
            </div>
        </div>
    )
}

export default RulesPage;