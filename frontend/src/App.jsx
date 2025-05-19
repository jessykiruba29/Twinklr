import { Box } from "@chakra-ui/react";
import {Route, Routes } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import CreatePage from "./CreatePage";
import Homepage from "./Homepage";

function App() {
  return (
    <Box minH="100vh">
     
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/create" element={<CreatePage />} />
        </Routes>
      
    </Box>
  );
}

export default App;
