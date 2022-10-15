import { useState } from 'react'
import './css/App.css'
import {Routes, Route} from "react-router-dom"
import Nav from './components/Nav';
import Dashboard from "./components/Dashboard";
import Dice from "./pages/Dice";
import Blackjack from "./pages/Blackjack";
import War from "./pages/War";

function App() {
  
  
  const navLinks = [
    {
      name: "Blackjack",
      path: "/blackjack",
    },
    {
      name: "War",
      path: "/war",
    },
    {
      name: "Dice",
      path: "/dice",
    },
  ];



  return (
    <div className="App">
      <Nav links={navLinks} />
      <Dashboard />

      <Routes>
        <Route path="/" element={<Blackjack />} />
        <Route path="/blackjack" element={<Blackjack />} />
        <Route path="/war" element={<War />} />
        <Route path="/dice" element={<Dice />} />
      </Routes>
    </div>
  );
}

export default App
