import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MountainIcon, XIcon } from "lucide-react";
import Navigation from "./Navigation";
import UserActions from "./UserActions";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Navbar: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const toggleBurgerMenu = () => setIsBurgerOpen(!isBurgerOpen);

  return (
    currentUser ? (
      <>
        <button
          type="button"
          onClick={toggleBurgerMenu}
          className={`h-10 w-10 md:hidden fixed top-5 right-5 transition-all duration-300 z-50 rounded-full justify-center items-center ${isBurgerOpen ? "opacity-0" : " border border-gray-700 opacity-100"}`}
        >
          <MountainIcon className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
          <span className="sr-only">Toggle Menu</span>
        </button>
        <div onClick={toggleBurgerMenu} className={`bg-black/40 h-[150dvh] w-[150dvw] fixed top-0 left-0 transition-opacity duration-300  ${isBurgerOpen ? "opacity-100 z-0" : "opacity-0 -z-50"}`} />
        <nav className={`border-r border-opacity-30 border-gray-700 absolute md:flex md:relative md:translate-x-0 top-0 min-h-dvh max-w-16 flex flex-col items-center justify-between text-[var(--color-primary)] bg-white p-5 shadow-sm dark:bg-gray-950 transition-all duration-300 ${isBurgerOpen ? "translate-x-0" : "-translate-x-20"}`}>
          <Link
            to='/'
            className="flex items-center"
          >
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only text-[var(--color-primary)]">Tribbit</span>
          </Link>
          <Navigation />
          <UserActions />
        </nav>
      </>
    ) : null
  );
};

export default Navbar;
