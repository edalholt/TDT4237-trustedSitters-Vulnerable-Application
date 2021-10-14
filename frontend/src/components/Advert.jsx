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
const Advert = ({ advert }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
          <Button size='small'>Make offer</Button>
          <IconButton size='small' onClick={handleOpen}>
            <EditIcon />
          </IconButton>
          <IconButton size='small'>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
      <Modal open={open} onClose={handleClose}>
        <EditAdvert
          action={"Edit"}
          title={"Edit Advert"}
          handleClose={handleClose}
          advert={advert}
          setOpen={setOpen}
        ></EditAdvert>
      </Modal>
    </>
  );
};

export default Advert;
