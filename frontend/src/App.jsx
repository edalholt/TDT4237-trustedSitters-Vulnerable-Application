import React, { useState, useEffect, useRef } from "react";
import Container from "@mui/material/Container";

import LoginForm from "./components/LoginForm";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Container maxWidth='md'>
      <LoginForm setUser={setUser}></LoginForm>
    </Container>
  );
};

export default App;
