import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditAdvert from "./EditAdvert";
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AdvertsService from "../services/adverts";
import OfferService from "../services/offers";

const Advert = ({
  advert,
  user,
  setAdverts,
  adverts,
  setSnackbarOpen,
  setSnackbarText,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleConfirmOpen = () => setConfirmOpen(true);
  const handleConfirmClose = () => setConfirmOpen(false);

  const [offerOpen, setOfferOpen] = useState(false);
  const handleOfferOpen = () => setOfferOpen(true);
  const handleOfferClose = () => setOfferOpen(false);

  const deleteAdvert = (e) => {
    e.preventDefault();
    AdvertsService.DeleteAdvert(advert.id)
      .then((response) => {
        console.log("Advert deleted successfully");
        setSnackbarText("Advert deleted successfully");
        setSnackbarOpen(true);
        setConfirmOpen(false);
        setAdverts(adverts.filter((a) => a.id !== advert.id));
      })
      .catch((err) => console.log(err));
  };

  const sendOffer = (e) => {
    e.preventDefault();
    OfferService.CreateOffer({
      recipient: advert?.owner,
      offerType: "JOB_OFFER",
      advert: advert?.id,
    })
      .then((o) => {
        setSnackbarText(`Offer sent to ${o.recipient}`);
        setSnackbarOpen(true);
        setOfferOpen(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
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

        <CardActions>
          {user?.username === advert.owner ? (
            <div>
              <IconButton size='small' onClick={handleOpen}>
                <EditIcon />
              </IconButton>
              <IconButton size='small' onClick={handleConfirmOpen}>
                <DeleteIcon />
              </IconButton>
            </div>
          ) : (
            <Button onClick={handleOfferOpen} size='small'>
              Make offer
            </Button>
          )}
        </CardActions>
      </Card>
      <Modal open={open} onClose={handleClose}>
        <EditAdvert
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarText={setSnackbarText}
          action={"Edit"}
          title={"Edit Advert"}
          handleClose={handleClose}
          advert={advert}
          setOpen={setOpen}
          adverts={adverts}
          setAdverts={setAdverts}
        ></EditAdvert>
      </Modal>
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{"Delete advert?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this advert? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>No</Button>
          <Button onClick={deleteAdvert} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={offerOpen}
        onClose={handleOfferClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{"Contract proposal"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Send offer to {advert?.owner}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOfferClose}>No</Button>
          <Button onClick={sendOffer} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Advert;
