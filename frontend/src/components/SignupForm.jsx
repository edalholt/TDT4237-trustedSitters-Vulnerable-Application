import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import Container from "@mui/material/Container";
import authService from "../services/auth";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Link from "@mui/material/Link";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const SignupForm = ({ setUser }) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameErrorText, setUsernameErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await authService.createUser({
        username: username,
        email: email,
        password: password,
      });
      setUser(response.user);
      window.localStorage.setItem("user", JSON.stringify(response.user));
      window.localStorage.setItem("refresh_token", response.refresh);
      window.localStorage.setItem("access_token", response.access);
      console.log("User registered successfully");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setSnackbarOpen(true);
      let msg = "";
      Object.values(err.response.data).forEach((x) => (msg += x));
      console.log(err.response);
      setSnackbarText(msg);
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
              required
              label='Username'
              onInput={(e) => setUsername(e.target.value)}
              value={username}
              error={!!usernameErrorText}
              helperText={usernameErrorText}
            />
            <TextField
              required
              label='E-mail'
              onInput={(e) => setEmail(e.target.value)}
              value={email}
              type='email'
            />

            <TextField
              required
              label='Password'
              type='password'
              onInput={(e) => setPassword(e.target.value)}
              value={password}
              error={!!passwordErrorText}
              helperText={passwordErrorText}
            ></TextField>
            <Button variant='contained' type='submit'>
              Sign Up
            </Button>
            <Link
              component='button'
              underline='hover'
              onClick={() => history.push("/login")}
            >
              Already registered? Click here to sign in!
            </Link>
          </Stack>
        </form>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity='error' sx={{ width: "100%" }}>
            {snackbarText}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default SignupForm;
