import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import TimePicker from "@mui/lab/TimePicker";
import AdvertsService from "../services/adverts";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const EditAdvert = (props) => {
  const [type, setType] = useState("");
  const [content, setContent] = useState(props.advert?.content);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const request = {
      date: date.toISOString().substring(0, 10),
      start_time: startTime?.toTimeString().substring(0, 8),
      end_time: endTime?.toTimeString().substring(0, 8),
      content: content,
    };
    if (props.action === "Create") {
      console.log(request);
      if (type === "IS_SITTER") {
        AdvertsService.CreateIsSitterAdvert(request)
          .then((response) => {
            // TODO: Popup snackbar with confirmation message, and re render the Adverts page
            props.setOpen(false);
          })
          .catch((err) => console.log(err.response.data));
      } else if (type === "ND_SITTER") {
        AdvertsService.CreateNeedSitterAdvert(request)
          .then((response) => {
            // TODO: Popup snackbar with confirmation message, and re render the Adverts page
            props.setOpen(false);
          })
          .catch((err) => console.log(err.response.data));
      } else {
        console.log(type);
      }
    } else if (props.action === "Edit") {
      // TODO: Send Patch request
    }
  };

  const handleSelect = (e) => {
    setType(e.target.value);
  };
  return (
    <Box sx={style}>
      <Typography sx={{ textAlign: "center" }} variant='h3'>
        {props.title}
      </Typography>
      <form onSubmit={onSubmit}>
        <FormControl component='fieldset'>
          <FormLabel component='legend'>Type</FormLabel>
          <RadioGroup row aria-label='type' onChange={handleSelect}>
            <FormControlLabel
              value='ND_SITTER'
              control={<Radio required />}
              label='Need Babysitter'
            />
            <FormControlLabel
              value='IS_SITTER'
              control={<Radio required />}
              label='Is Babysitter'
            />
          </RadioGroup>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={2} padding={2}>
            <TextField
              multiline
              minRows={2}
              onInput={(e) => setContent(e.target.value)}
              value={content}
              label={"Description"}
              required
            />

            <DatePicker
              label='Date'
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <Stack spacing={2} direction='row' justifyContent='center'>
              <TimePicker
                ampm={false}
                label='Start Time'
                value={startTime}
                onChange={(newValue) => {
                  setStartTime(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <TimePicker
                ampm={false}
                label='End Time'
                value={endTime}
                onChange={(newValue) => {
                  setEndTime(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
            <Stack spacing={2} direction='row' justifyContent='center'>
              <Button
                variant='contained'
                color='error'
                onClick={props.handleClose}
              >
                Cancel
              </Button>
              <Button variant='contained' color='success' type='submit'>
                {props.action}
              </Button>
            </Stack>
          </Stack>
        </LocalizationProvider>
      </form>
    </Box>
  );
};

export default EditAdvert;
