import React, { useState, useEffect } from "react";
import ToysService from "../services/toys";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";

const Toys = () => {
  const [toys, setToys] = useState(null);

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const updateToys = () => {
    ToysService.GetToys()
      .then((t) => {
        setToys(t);
        console.log(t);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    console.log("Hello");
    updateToys();
  }, []);

  const uploadToy = () => {
    const data = { description: description, price: price };

    ToysService.CreateToy(data)
      .then((response) => {
        console.log("Toy upload complete");
        console.log(response);
        updateToys();
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <Stack spacing={2} padding={2}>
        <TextField
          onInput={(e) => setDescription(e.target.value)}
          value={description}
          label={"Description"}
        />
        <TextField
          onInput={(e) => setPrice(e.target.value)}
          value={price}
          label={"Price"}
        />
        <Button onClick={uploadToy} variant='contained'>
          Add toy
        </Button>
      </Stack>
      {toys?.map((t) => (
        <h4 key={t.description}>
          {t.description}, {t.price}
        </h4>
      ))}
    </>
  );
};

export default Toys;
