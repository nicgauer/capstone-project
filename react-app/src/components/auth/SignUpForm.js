import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, NavLink } from 'react-router-dom';
import { signUp } from '../../store/session';
import { newDeck } from '../../services/deck';
import styles from './LoginForm.module.css';

const SignUpForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      await dispatch(signUp(username, email, password));
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/store" />;
  }

  return (
    <div className={styles.loginWrapper}>
      <h3>Welcome to</h3>
      <h1>SUPER BATTLE CARDS</h1>
      <form className={styles.loginForm} onSubmit={onSignUp}>
        <div className={styles.usernameInput}>
          <label>User Name</label>
          <input
            type="text"
            name="username"
            onChange={updateUsername}
            value={username}
            className={styles.usernameBox}
          ></input>
        </div>
        <div className={styles.emailInput}>
          <label>Email</label>
          <input
            type="text"
            name="email"
            onChange={updateEmail}
            value={email}
            className={styles.emailBox}
          ></input>
        </div>
        <div className={styles.passwordInput}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={updatePassword}
            value={password}
            className={styles.passwordBox}
          ></input>
        </div>
        <div className={styles.passwordInput}>
          <label>Repeat Password</label>
          <input
            type="password"
            name="repeat_password"
            onChange={updateRepeatPassword}
            value={repeatPassword}
            required={true}
            className={styles.passwordBox}
          ></input>
        </div>
        <button className={styles.loginButton} type="submit">Sign Up</button>
      </form>
      <div className={styles.signUp}>
          <h1>
            Have an account already?
          </h1>
          <NavLink to="/login">Log In</NavLink>
        </div>
    </div>
  );
};

export default SignUpForm;
