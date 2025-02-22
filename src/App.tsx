import { Routes, Route } from "react-router-dom";
import { Nav } from "./components/layout/Nav";
import { Dashboard } from "./components/Dashboard";
import { CardDeck } from "./components/Deck";

export const App = () => {
  return (
    <div className="App dark h-screen w-screen bg-gray-950">
      <Nav />
      <Dashboard />

      <div
        className="relative max-w-screen-lg mx-auto mt-8 min-w-min shadow-xl overflow-hidden"
        style={{
          backgroundImage: "url('/images/blue-table.jpg')",
          backgroundPosition: "top center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <div className="relative z-10 flex justify-center gap-8 p-4 border border-white/10">
          <Routes>
            <Route path="/" element={<CardDeck />} />
            {/* <Route path="/blackjack" element={<Blackjack />} />
            <Route path="/war" element={<War />} />
            <Route path="/dice" element={<Dice />} />
            <Route path="/poker" element={<Poker />} />
            <Route path="/deck" element={<CardDeck />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
};
