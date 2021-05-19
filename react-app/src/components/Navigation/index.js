import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Navigation.module.css'


const Navigation = ({currentLocation}) => {
    const user = useSelector(state => state.session.user);

    return (
        <nav className={styles.navbar}>
            <div className={styles.navlink}>
                <NavLink className={currentLocation === 'home' ? styles.current : styles.link} to="/" exact={true} activeClassName="active">
                    Home
                </NavLink>
            </div>
            {!user && (
                <div className={styles.navlink}>
                    <NavLink className={styles.link} to="/login" exact={true} activeClassName="active">
                        Login
                    </NavLink>
                </div>
            )}
            {!user && (
                <div className={styles.navlink}>
                    <NavLink className={styles.link} to="/sign-up" exact={true} activeClassName="active">
                        Sign Up
                    </NavLink>
                </div>
            )}
            {user && (
                <div className={styles.navlink}>
                    <NavLink className={currentLocation === 'store' ? styles.current : styles.link} to='/store'>Store</NavLink>
                </div>
            )}
            {user && (
                <div className={styles.navlink}>
                    <NavLink className={currentLocation === 'collection' ? styles.current : styles.link} to='/collection'>Card Collection</NavLink>
                </div>
            )}
            {user && (
                <div className={styles.navlink}>
                    <NavLink className={currentLocation === 'profile' ? styles.current : styles.link} to={`/users/${user.id}`}>Profile</NavLink>
                </div>
            )}
        </nav>
    )
}

export default Navigation;