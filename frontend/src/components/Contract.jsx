import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ContractsService from "../services/contract";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Contract = ({ user, contract }) => {
  const finishContract = (e) => {
    e.preventDefault();

    ContractsService.FinishContract({ contractId: contract.id })
      .then((response) => {
        console.log(response);
        // contract.finished = true;
        setOpen(false);
        // TODO: Snackbar confirmation and rerender
      })
      .catch((error) => {
        console.log(error.response?.data);
      });
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
            {contract.date}
          </Typography>
          <Typography variant='h5' component='div'>
            Parent: {contract.parent}
          </Typography>
          <Typography variant='h5' component='div'>
            Sitter: {contract.sitter}
          </Typography>

          <Typography sx={{ mb: 1.5 }} color='text.secondary'>
            {contract.start_time} -- {contract.end_time}
          </Typography>
          <Typography variant='body2'>{contract.content}</Typography>
        </CardContent>

        <CardActions>
          {user?.username === contract.parent && !contract.finished ? (
            <Button onClick={handleOpen} size='small'>
              Finish contract
            </Button>
          ) : null}
        </CardActions>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{"Finish contract"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to finish the contract?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={finishContract} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Contract;
