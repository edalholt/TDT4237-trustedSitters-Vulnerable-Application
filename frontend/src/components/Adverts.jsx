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
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const Adverts = ({ user }) => {
  const [adverts, setAdverts] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const fabStyle = {
    position: "absolute",
    bottom: 20,
    right: 20,
  };

  // Options for ordering adverts
  const optionsDictionary = {
    "Advert type": "advertType",
    Date: "date",
    "Start time": "start_time",
    "End time": "end_time",
  };
  // Retrieve adverts with specific ordering
  const handleOrderBy = (e) => {
    AdvertsService.GetAllAdvertsOrderBy(optionsDictionary[e.value]).then(
      (ads) => setAdverts(ads)
    );
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
      <Typography sx={{ textAlign: "center" }} variant='body'>
        *short description of the Adverts page*
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

      <Dropdown
        options={Object.keys(optionsDictionary)}
        onChange={handleOrderBy}
        placeholder='Order by...'
      />

      <Grid container spacing={1.5} justifyContent='center'>
        {adverts?.map((advert) => (
          <Grid key={advert.id} item xs={3}>
            <Advert
              setSnackbarOpen={setSnackbarOpen}
              setSnackbarText={setSnackbarText}
              adverts={adverts}
              setAdverts={setAdverts}
              user={user}
              advert={advert}
            ></Advert>
          </Grid>
        ))}
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <EditAdvert
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarText={setSnackbarText}
          action={"Create"}
          title={"Create Advert"}
          handleClose={handleClose}
          setOpen={setOpen}
          adverts={adverts}
          setAdverts={setAdverts}
        ></EditAdvert>
      </Modal>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity='success'
          sx={{ width: "100%" }}
        >
          {snackbarText}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Adverts;
