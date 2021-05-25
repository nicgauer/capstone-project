import React, {useState} from 'react';
import styles from './RulePage.module.css';

const RulesPage = () => {

    return (
        <div className={styles.rulesWrapper}>
            <h1 className={styles.rulesHeader}>- Super Battle Cards Official Rules -</h1>
            <div className={styles.rulesContainer}>
                <h3>The goal of super battle cards is to destroy your opponent's health points.</h3>
                <p>
                    Each player begins with the same amount of health points.  Each player takes turns, using cards to attempt to damage the other player's health.  Turns have three phases: a draw phase, a placement phase, and a combat phase.
                </p>
                <p>On their draw phase, a player draws a card from their deck.  If there are no more cards to draw, they lose the game.  If a player successfully draws a card, they immediately advance to the placement phase.</p>
                <p>
                    There are two types of cards in Super Battle Cards.  Spell cards (green), and Unit cards (yellow).  Spell cards are instant use effect cards, and are used in the placement phase.  Read their description carefully.  
                    Unit cards are used to protect yourself and attack your opponent.  They can be placed on the field in placement phase.
                </p>
                <p>
                    There are also two types of Unit cards in Super Battle Cards -- Basic, and Evolved.  You can only place ONE basic unit card per placement phase.  However, you can place any number of evolutions per placement phase, 
                    as long as their basic form is already placed on the field.  Any power up cards used on the basic unit will carry over to its evolved counterpart.
                </p>
                <p>
                    The combat phase begins when the player ends their placement phase.
                    On turn 1, the combat phase is automatically skipped for the player who plays first, to prevent an unfair advantage.
                </p>
                <p>
                    In the combat phase, a player can select one of their units, and attack an opponents' unit.  If a player has no units on the field, their health can be attacked directly, but they cannot be directly attacked unless they are completely undefended.  
                    Combat is calculated by comparing the attacking unit's attack against the defending unit's defense.  Whichever is bigger wins, and the loser loses the difference in health points.
                </p>
                <p>
                    After the combat phase, a player must click "end turn" in order to advance the game to the next player's turn.
                </p>
            </div>
        </div>
    )
}

export default RulesPage;