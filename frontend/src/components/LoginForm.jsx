import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import Container from "@mui/material/Container";
import AuthService from "../services/auth";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import { useHistory } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const LoginForm = ({ setUser, setAppSnackbarOpen, setAppSnackbarText }) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameErrorText, setUsernameErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [otp, setOtp] = useState('');
  const [failed, setFailed] = useState(false);
  const [id, setId] = useState('')
  const [email, setEmail] = useState('')

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

    const request = { username: username, password: password };

    AuthService.login(request)
      .then((response) => {
        if(response.mfa_active){
          setActive(true)
          setEmail(response.user['email'])
          setId(response.user['id'])
          console.log(response.user)
        }
        else {
          console.log("Signed in successfully");
          setUsername("");
          setPassword("");
          setUser(response.user);
          history.push("/adverts");
          setAppSnackbarText("Signed in successfully");
          setAppSnackbarOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setSnackbarOpen(true);
        setUsernameErrorText("Wrong username or password");
        setPasswordErrorText("Wrong username or password");
      });
  };

  const onSubmitOTP = (e) => {
    e.preventDefault()
    setFailed(false)
    AuthService.postMFAToken(otp).then((active)=>{
        if(active){
            setFailed(true)
            setUser({
              id: id,
              username: username,
              email: email
            })
            console.log("Signed in successfully");
            setUsername("");
            setPassword("");
            history.push("/adverts");
            setAppSnackbarText("Signed in successfully");
            setAppSnackbarOpen(true);
        } else setFailed(false)
    })
  }
  return (
    <>
      <Container maxWidth='xs'>
        <Stack spacing={2} padding={2}>
        <img alt='logo' src='/baby-stroller.png' />
        </Stack>
        {active ?
            <form onSubmit={onSubmitOTP}>
              <Stack spacing={2} padding={2}>
              <TextField
                onInput={(e) => setOtp(e.target.value)}
                label='One-time-password'
              />
              </Stack>
            </form>  
            : null
        }
        <form onSubmit={onSubmit}>
          <Stack spacing={2} padding={2}>
            
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
            <Link
              component='button'
              underline='hover'
              onClick={() => history.push("/signup")}
            >
              Not registered? Click here to sign up!
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
            Login Failed! Please check you credentials.
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default LoginForm;
