import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import Container from "@mui/material/Container";
import authService from "../services/auth";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameErrorText, setUsernameErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setUsernameErrorText("Please enter username");
    } else {
      setUsernameErrorText("");
    }
    if (!password) {
      setPasswordErrorText("Please enter password");
    } else {
      setPasswordErrorText("");
    }

    if (!username || !password) {
      return;
    }
    try {
      const response = await authService.login({
        username: username,
        password: password,
      });
      setUser(response.user);
      window.localStorage.setItem("user", JSON.stringify(response.user));
      window.localStorage.setItem("refresh_token", response.refresh);
      window.localStorage.setItem("access_token", response.access);
      console.log("Signed in successfully");
      setUsername("");
      setPassword("");
    } catch (err) {
      setSnackbarOpen(true);
      setUsernameErrorText("Wrong username or password");
      setPasswordErrorText("Wrong username or password");
    }
  };
  return (
    <>
      <Container maxWidth='xs'>
        <form onSubmit={onSubmit}>
          <Stack spacing={2} padding={2}>
            <img
              alt='logo'
              src='https://cdn.pixabay.com/photo/2014/08/15/22/27/house-insurance-419058_960_720.jpg'
            />
            <TextField
              label='Username'
              onInput={(e) => setUsername(e.target.value)}
              value={username}
              error={!!usernameErrorText}
              helperText={usernameErrorText}
            />

            <TextField
              label='Password'
              type='password'
              onInput={(e) => setPassword(e.target.value)}
              value={password}
              error={!!passwordErrorText}
              helperText={passwordErrorText}
            ></TextField>
            <Button variant='contained' type='submit'>
              Sign In
            </Button>
          </Stack>
        </form>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity='error' sx={{ width: "100%" }}>
            Login Failed! Please check you credentials.
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default LoginForm;
