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
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import Link from "@mui/material/Link";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Child = ({ child, user, children, setChildren }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label='show more'
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <CardContent>
            <Link component='button' underline='hover'>
              Dummy file link
            </Link>
            <Link component='button' underline='hover'>
              Dummy file link
              <IconButton size='small'>
                <DeleteIcon />
              </IconButton>
            </Link>
            <input
              type='file'
              onChange={(e) => setSelectedFile(e.target.files[0])}
            ></input>
          </CardContent>
          <CardActions>
            <Button>Upload file</Button>
          </CardActions>
        </Collapse>
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
