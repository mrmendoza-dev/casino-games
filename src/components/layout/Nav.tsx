import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

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
    // { name: "Poker", path: "/poker" },
    // { name: "Blackjack", path: "/blackjack" },
    // { name: "War", path: "/war" },
    // { name: "Dice", path: "/dice" },
    // { name: "Deck", path: "/deck" },
  ];

  return (
    <div
      className={cn(
        "w-full bg-gray-900 backdrop-blur-sm border-b border-white/10",
        "sticky top-0 z-50",
        className
      )}
    >
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
        </Link>
        {/* Navigation Links */}
        <NavigationMenu>
          <NavigationMenuList className="gap-1">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.path}>
                <Link to={link.path}>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "px-4 py-2 text-sm transition-colors",
                      "hover:bg-white/10",
                      "data-[active]:bg-white/10 data-[active]:text-white text-foreground",
                      location.pathname === link.path &&
                        "bg-white/10 text-white"
                    )}
                  >
                    {link.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        {/* Right Side Section - Reserved for future use */}
        <div className="w-[100px]" /> {/* Spacer for alignment */}
      </div>
    </div>
  );
};
