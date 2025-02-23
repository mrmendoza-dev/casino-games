import { Routes, Route } from "react-router-dom";
import { Nav } from "./components/layout/Nav";
import { Dashboard } from "./components/Dashboard";
import { CardDeck } from "./components/Deck";
import { Blackjack } from "./pages/Blackjack";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Providers } from "@/contexts/Providers";

export const App = () => {
  return (
    <Providers>
        <div className="App dark h-screen w-screen bg-gray-950 flex flex-col">
          <Nav />
          <Dashboard />

          <div
            className="relative max-w-screen-lg flex-grow w-full mx-auto mt-4 min-w-min shadow-xl overflow-y-auto"
            style={{
              backgroundImage: "url('/images/blue-table.jpg')",
              backgroundPosition: "top center",
              backgroundSize: "cover",
              backgroundAttachment: "fixed",
            }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm border border-white/10 h-full" />

            <ScrollArea className="h-full">
              <div className="relative z-10 flex justify-center gap-8 p-4">
                <Routes>
                  <Route path="/" element={<CardDeck />} />
                  <Route path="/blackjack" element={<Blackjack />} />
                  {/* <Route path="/war" element={<War />} /> */}
                  {/* <Route path="/dice" element={<Dice />} /> */}
                  {/* <Route path="/poker" element={<Poker />} /> */}
                  <Route path="/deck" element={<CardDeck />} />
                </Routes>
              </div>
            </ScrollArea>
          </div>
        </div>
    </Providers>
            
  );
};

