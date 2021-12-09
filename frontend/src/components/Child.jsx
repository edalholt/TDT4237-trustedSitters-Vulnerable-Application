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
import ChildrenService from "../services/children";
import { Stack } from "@mui/material";

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

const Child = ({ child, user, children, setChildren, files }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const uploadFile = (e) => {
    e.preventDefault();

    let formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("child", child.id);
    ChildrenService.UploadChildFile(formData)
      .then((response) => console.log(response))
      .catch((error) => console.error(error));
  };

  const downloadFile = (url) => {
    ChildrenService.DownloadChildFile(url)
      .then((response) => {
        const file = new File([response], url, { type: response.type });
        window.open(URL.createObjectURL(file));
      })
      .catch((error) => console.error(error));
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

        {/* Contend inside dropdown */}
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <CardContent>
            {files
              ?.filter((file) => file.child === child.id)
              .map((file) => (
                <Stack spacing={2} direction='row' justifyContent='right'>
                  <Button
                    key={file.id}
                    component='button'
                    onClick={() => downloadFile(file.link)}
                    underline='hover'
                  >
                    {file.name}
                  </Button>
                  {user.username === child.parent ? (
                    <IconButton size='small'>
                      <DeleteIcon />
                    </IconButton>
                  ) : null}
                </Stack>
              ))}

            <input
              type='file'
              onChange={(e) => setSelectedFile(e.target.files[0])}
            ></input>
          </CardContent>
          <CardActions>
            <Button onClick={uploadFile}>Upload file</Button>
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
