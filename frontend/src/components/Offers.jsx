import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Offer from "./Offer";
import OfferService from "../services/offers";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
const Offers = ({ user }) => {
  const [offers, setOffers] = useState(null);
  const [recipient, setRecipient] = useState("");

  useEffect(() => {
    console.log("effect");
    handleUpdate();
  }, []);

  const handleUpdate = () => {
    OfferService.GetOffers().then((o) => setOffers(o));
  };
  const sendOffer = (e) => {
    e.preventDefault();
    OfferService.CreateOffer({
      recipient: recipient,
      offerType: "GUARDIAN_OFFER",
    })
      .then((o) => setOffers(offers.concat(o)))
      .catch((err) => console.log(err));
  };
  return (
    <Container>
      <Stack spacing={2} margin={5} direction='row' justifyContent='center'>
        <TextField
          onInput={(e) => setRecipient(e.target.value)}
          value={recipient}
          label={"Offer Recipient Username"}
          required
        />
        <Button variant='contained' color='secondary' onClick={sendOffer}>
          Send Guardian offer
        </Button>
      </Stack>
      <Typography sx={{ textAlign: "center" }} variant='h3'>
        Pending offers
      </Typography>

      <Grid container spacing={1.5} justifyContent='center'>
        {offers
          ?.filter((o) => o.status === "P")
          .map((o) => (
            <Grid key={o.id} item xs={3}>
              <Offer
                onUpdate={() => handleUpdate()}
                offer={o}
                user={user}
              ></Offer>
            </Grid>
          ))}
      </Grid>
      <Typography sx={{ textAlign: "center" }} variant='h3'>
        Answered offers
      </Typography>
      <Grid container spacing={1.5} justifyContent='center'>
        {offers
          ?.filter((o) => o.status !== "P")
          .map((o) => (
            <Grid key={o.id} item xs={3}>
              <Offer
                onUpdate={() => handleUpdate()}
                offer={o}
                user={user}
              ></Offer>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default Offers;
