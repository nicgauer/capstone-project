import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Navigation.module.css'


const Navigation = () => {
    const user = useSelector(state => state.session.user);

    return (
        <nav className={styles.navbar}>
            <div className={styles.navlink}>
                <NavLink to="/" exact={true} activeClassName="active">
                    Home
                </NavLink>
            </div>
            {!user && (
                <div className={styles.navlink}>
                    <NavLink to="/login" exact={true} activeClassName="active">
                        Login
                    </NavLink>
                </div>
            )}
            {!user && (
                <div className={styles.navlink}>
                    <NavLink to="/sign-up" exact={true} activeClassName="active">
                        Sign Up
                    </NavLink>
                </div>
            )}
            {user && (
                <div className={styles.navlink}>
                    <NavLink to='/store'>Store</NavLink>
                </div>
            )}
            {user && (
                <div className={styles.navlink}>
                    <NavLink to='/collection'>Card Collection</NavLink>
                </div>
            )}
        </nav>
    )
}

export default Navigation;