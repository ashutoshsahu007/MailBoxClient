import React from "react";
import Auth from "./components/Auth";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import MailBoxClient from "./components/MailBoxClient";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/mail" element={<MailBoxClient />} />
      </Routes>
    </div>
  );
};

export default App;
