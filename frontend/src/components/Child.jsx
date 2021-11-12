import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditChild from "./EditChild";
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
const Child = ({ child, user, children, setChildren }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant='h5' component='div'>
            {child.name}
          </Typography>
          <div dangerouslySetInnerHTML={{ __html: child.info }}></div>
        </CardContent>

        <CardActions>
          {user?.username === child.parent ? (
            <div>
              <IconButton size='small' onClick={handleOpen}>
                <EditIcon />
              </IconButton>
              <IconButton size='small'>
                <DeleteIcon />
              </IconButton>
            </div>
          ) : null}
        </CardActions>
      </Card>
      <Modal open={open} onClose={handleClose}>
        <EditChild
          children={children}
          setChildren={setChildren}
          action={"Edit"}
          title={"Edit Child Entry"}
          handleClose={handleClose}
          child={child}
          setOpen={setOpen}
        ></EditChild>
      </Modal>
    </>
  );
};

export default Child;
