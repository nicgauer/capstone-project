import React, { useState } from "react";
import  { useDispatch, useSelector } from "react-redux";
import { Redirect, NavLink } from "react-router-dom";
import { login } from "../../store/session";
import styles from './LoginForm.module.css'

const LoginForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data.errors) {
      setErrors(data.errors);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className={styles.loginWrapper}>
      <h3>Welcome to</h3>
      <h1>SUPER BATTLE CARDS</h1>
      <form className={styles.loginForm} onSubmit={onLogin}>
        <div>
          {errors.map((error) => (
            <div>{error}</div>
          ))}
        </div>
        <div className={styles.emailInput}>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={updateEmail}
            className={styles.emailBox}
          />
        </div>
        <div className={styles.passwordInput}>
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={updatePassword}
            className={styles.passwordBox}
          />
          <button className={styles.loginButton} type="submit">Login</button>
        </div>

        <div className={styles.signUp}>
          <h1>
            Don't Have an Account?
          </h1>
          <NavLink to="/sign-up">Sign Up</NavLink>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
