import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Advert = ({content}) => {
  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          dd.mm.yyyy
        </Typography>
        <Typography variant="h5" component="div">
          Need babysitter
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          time start -- Time end
        </Typography>
        <Typography variant="body2">
          {content}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Make offer</Button>
      </CardActions>
    </Card>
  );
};

export default Advert;
