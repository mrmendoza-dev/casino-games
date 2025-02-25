import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MusicPlayer } from "@/components/MusicPlayer";

interface NavLink {
  name: string;
  path: string;
}

interface NavProps {
  className?: string;
}

export const Nav = ({ className }: NavProps) => {
  const location = useLocation();

  const navLinks: NavLink[] = [
    // { name: "Home", path: "/" },
    // { name: "Poker", path: "/poker" },
    { name: "Blackjack", path: "/blackjack" },
    // { name: "War", path: "/war" },
    // { name: "Dice", path: "/dice" },
    { name: "Deck", path: "/deck" },
    { name: "Roulette", path: "/roulette" },
  ];

  return (
    <div
      className={cn(
        "w-full bg-gray-900 backdrop-blur-sm border-b border-white/10",
        "sticky top-0 z-50",
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-all duration-300 hover:opacity-80 hover:scale-105"
        >
          <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="text-white font-bold text-xl">Casino</span>
        </Link>

        <div className="flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-base font-medium transition-all duration-300",
                "px-3 py-2 rounded-md relative",
                "hover:text-white hover:bg-white/10",
                location.pathname === link.path
                  ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-cyan-500"
                  : "text-gray-300"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <MusicPlayer />
      </div>
    </div>
  );
};
