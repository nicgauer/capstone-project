import React, { useState, useEffect } from "react";
import { useDispatch} from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
// import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import UserPage from "./components/UserPage";
// import { authenticate } from "./services/auth";
import { authenticate } from "./store/session";
import MatchmakingLobby from "./components/MatchmakingLobby";
import CardStore from './components/CardStore'
import CardCollection from './components/CardCollection';

function App() {
  // const [authenticated, setAuthenticated] = useState(false);
  const dispatch = useDispatch()
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async() => {
      await dispatch(authenticate())
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      {/* <NavBar /> */}
      <Switch>
        <Route path="/login" exact={true}>
          <LoginForm />
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path="/users" exact={true} >
          <UsersList/>
        </ProtectedRoute>
        <ProtectedRoute path="/users/:userId" exact={true} >
          <UserPage />
        </ProtectedRoute>
        <ProtectedRoute path="/" exact={true}>
          {/* <h1>My Home Page</h1> */}
          <MatchmakingLobby />
        </ProtectedRoute>
        <ProtectedRoute path="/store" exact={true}>
          <CardStore />
        </ProtectedRoute>
        <ProtectedRoute path="/collection" exact={true}>
          <CardCollection />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
