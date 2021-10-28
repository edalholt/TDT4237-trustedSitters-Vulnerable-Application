import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Advert from "./Advert";
import AdvertsService from "../services/adverts";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditAdvert from "./EditAdvert";
import Modal from "@mui/material/Modal";

const Adverts = ({ user }) => {
  const [adverts, setAdverts] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fabStyle = {
    position: "absolute",
    bottom: 20,
    right: 20,
  };
  useEffect(() => {
    console.log("effect");
    AdvertsService.GetAllAdverts().then((ads) => setAdverts(ads));
  }, []);

  return (
    <Container>
      <Typography sx={{ textAlign: "center" }} variant='h2'>
        Adverts
      </Typography>
      <Fab
        sx={fabStyle}
        variant='extended'
        color='secondary'
        aria-label='add'
        onClick={handleOpen}
      >
        <AddIcon sx={{ mr: 1 }} />
        Create new advert
      </Fab>

      <Grid container spacing={1.5} justifyContent='center'>
        {adverts?.map((advert) => (
          <Grid key={advert.id} item xs={3}>
            <Advert user={user} advert={advert}></Advert>
          </Grid>
        ))}
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <EditAdvert
          action={"Create"}
          title={"Create Advert"}
          handleClose={handleClose}
          setOpen={setOpen}
        ></EditAdvert>
      </Modal>
    </Container>
  );
};

export default Adverts;
