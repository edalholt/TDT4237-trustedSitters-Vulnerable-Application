import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Advert from "./Advert";
import AdvertsService from "../services/adverts";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

const Adverts = () => {
  const [adverts, setAdverts] = useState(null);

  const fabStyle = {
    position: 'absolute',
    bottom: 20,
    right: 20,
  };
  useEffect(() => {
    console.log("effect");
    AdvertsService.GetNeedSitterAdverts().then((ads) => setAdverts(ads));
  }, []);

  return (
    <Container>
      <Typography sx={{ textAlign: "center" }} variant="h2">
        Adverts
      </Typography>
      <Fab sx={fabStyle} variant="extended" color="secondary" aria-label="add">
        <AddIcon sx={{ mr: 1 }} />
            Create new advert
      </Fab>
      
      <Grid container spacing={1.5} justifyContent="center">
        {adverts?.map((advert) => (
          <Grid item xs={3}>
            <Advert content={advert.content}></Advert>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Adverts;
