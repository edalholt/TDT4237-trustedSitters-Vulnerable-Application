import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import OfferService from "../services/offers";
import AdvertsService from "../services/adverts";
import { Stack } from "@mui/material";
const Offer = ({ offer, user, onUpdate }) => {
  const [advert, setAdvert] = useState(null);
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

  useEffect(() => {
    if (offer.advert !== null) {
      console.log("effect");
      AdvertsService.GetAdvert(offer.advert)
        .then((ad) => setAdvert(ad))
        .catch((err) => console.log(err));
    }
  }, []);
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

          {offer.offerType === "JOB_OFFER" && advert !== null ? (
            <Card>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  {advert.date}
                </Typography>
                <Typography variant='h5' component='div'>
                  {advert.advertType}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  {advert.start_time} -- {advert.end_time}
                </Typography>
                <Typography variant='body2'>{advert.content}</Typography>
              </CardContent>
            </Card>
          ) : null}
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
