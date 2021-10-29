import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import OfferService from "../services/offers";
import { Stack } from "@mui/material";
const Offer = ({ offer, user, onUpdate }) => {
  const answerOffer = (status) => {
    OfferService.AnswerOffer({ offerId: offer.id, status: status })
      .then((answer) => {
        console.log(answer);
        onUpdate();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant='body' component='div'>
            Status: {offer.status}
          </Typography>
          <Typography variant='body' component='div'>
            Sender: {offer.sender}
          </Typography>
          <Typography variant='body' component='div'>
            Recipient: {offer.recipient}
          </Typography>
        </CardContent>

        <CardActions>
          {user?.username === offer.recipient && offer.status === "P" ? (
            <Stack spacing={2} direction='row' justifyContent='center'>
              <Button
                size='small'
                variant='contained'
                color='success'
                onClick={() => answerOffer("A")}
              >
                Accept
              </Button>
              <Button
                size='small'
                variant='contained'
                color='error'
                onClick={() => answerOffer("D")}
              >
                Decline
              </Button>
            </Stack>
          ) : null}
        </CardActions>
      </Card>
    </>
  );
};

export default Offer;
