import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
