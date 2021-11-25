import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import AuthService from "../services/auth";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import TextField from "@mui/material/TextField";


const Security = ({user}) => {
    const [mfa_token, setHash] = useState('');
    const [otp, setOtp] = useState('');
    const [active, setActive] = useState(false);
    const [failed, setFailed] = useState(false);


    const enableMFA = () => {
        console.log('click')
        console.log(user)
        AuthService.getMFAToken().then((data) => {
            setHash(data['mfa_token'])
            setActive(data['active'])
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setFailed(false)
        AuthService.postMFAToken(otp).then((active)=>{
            setActive(active)
            if(!active){
                setFailed(true)
            } else setFailed(false)
        })
    }

    useEffect(() => {
        //Runs on the first render
        //And any time any dependency value changes
      }, [mfa_token, active, failed]);

    return (
        <Container>
            <Typography sx={{ textAlign: "center" }} variant='h2'>
                Security
            </Typography>
            <Typography>
                User: {user?.username}
            </Typography>
            <Typography>
                Email: {user?.email}
            </Typography>
            {!active && !mfa_token ? 
                <Typography>
                <Button variant='contained' color='secondary' onClick={enableMFA}>
                    SHOW MFA
                </Button>                    
                </Typography> 
                : null
            }
            {mfa_token ?
                <Container>
                    <QRCode value={mfa_token}/>
                </Container>
            : null}
            {!active && mfa_token ?
            <Container>
                <Typography>
                    Verify one-time-password:
                </Typography>
                <form onSubmit={onSubmit}>
                    <TextField
                        onInput={(e) => setOtp(e.target.value)}
                    />
                </form>       
            </Container>
            : null
            }
            {active ? 
                <Typography>
                    MFA has been activated on this account
                </Typography>
                : null
            }
            {failed ? 
                <Typography>
                    Wrong one-time-password, please try again.
                </Typography>
                : null
            }
        </Container>
    );
};
export default Security;