// import { Toaster } from "@/components/ui/toaster";

import { Routes, Route } from "react-router-dom";
import { Nav } from "@/components/layout/Nav";
import { Dashboard } from "@/components/Dashboard";
import { CardDeck } from "@/components/Deck";
import { Blackjack } from "@/pages/Blackjack";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Providers } from "@/contexts/Providers";
import { RouletteWheel } from "@/components/Roulette";
import { Toaster } from "@/components/ui/sonner";

import "@/styles/Roulette.css";

export const ApplicationShell = () => {
  return (
    <div className="fixed inset-0 flex flex-col dark bg-gray-950">
      <Nav />
      <Dashboard />
      <div className="flex flex-1 overflow-hidden">
        <div
          className="relative max-w-screen-lg flex-grow w-full mx-auto mt-4 min-w-min shadow-xl flex overflow-hidden" // Remove flex-1
          style={{
            backgroundImage: "url('/images/blue-table.jpg')",
            backgroundPosition: "top center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm border border-white/10" />{" "}
          <ScrollArea className="w-full">
            {" "}
            {/* Change to w-full instead of h-full */}
            <div className="relative z-10 flex justify-center gap-8 p-4">
              <Routes>
                <Route path="/" element={<CardDeck />} />
                <Route path="/blackjack" element={<Blackjack />} />
                <Route path="/roulette" element={<RouletteWheel />} />
                {/* <Route path="/war" element={<War />} /> */}
                {/* <Route path="/dice" element={<Dice />} /> */}
                {/* <Route path="/poker" element={<Poker />} /> */}
                <Route path="/deck" element={<CardDeck />} />
              </Routes>
            </div>
          </ScrollArea>
        </div>
      </div>
      <Toaster />
    </div>
  );
};
