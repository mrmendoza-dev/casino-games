import { useState } from 'react'
import './css/App.css'
import {Routes, Route} from "react-router-dom"
import Nav from './components/Nav';
import Dashboard from "./components/Dashboard";
import Dice from "./pages/Dice";
import Blackjack from "./pages/Blackjack";
import War from "./pages/War";
import Poker from "./pages/Poker";
import Deck from "./components/Deck";
import CardDeck from "./pages/CardDeck";
import Home from "./pages/Home";

function App() {

  return (
    <div className="App">
      <Nav />
      <Dashboard />

      <div className="container">
        <Routes>
          <Route path="/" element={<CardDeck />} />
          <Route path="/blackjack" element={<Blackjack />} />
          <Route path="/war" element={<War />} />
          <Route path="/dice" element={<Dice />} />
          <Route path="/poker" element={<Poker />} />
          <Route path="/deck" element={<CardDeck />} />
        </Routes>
      </div>
    </div>
  );
}

export default App
