import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";

import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

const App = () => {
  const [user, setUser] = useState(null);

  const signOut = () => {
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("refresh_token");
    window.localStorage.removeItem("access_token");
    setUser(null);
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  return (
    <Router>
      <AppBar position='static'>
        <Toolbar>
          <Grid container>
            <Grid item>
              <Button color='inherit' component={Link} to='/adverts'>
                adverts
              </Button>
              <Button color='inherit' component={Link} to='/children'>
                children
              </Button>
              <Button color='inherit' component={Link} to='/offers'>
                offers
              </Button>
            </Grid>
          </Grid>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              {user ? (
                <Button color='inherit' onClick={signOut}>
                  Sign Out
                </Button>
              ) : (
                <div>
                  <Button color='inherit' component={Link} to='/login'>
                    Sign In
                  </Button>
                  <Button
                    variant='outlined'
                    color='inherit'
                    component={Link}
                    to='/signup'
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Container maxWidth='md'>
        <Switch>
          <Route path='/login'>
            <LoginForm setUser={setUser} />
          </Route>
          <Route path='/signup'>
            <SignupForm setUser={setUser} />
          </Route>
          <Route path='/'>{/* <Home /> */}</Route>
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
