import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import UserActions from "./UserActions";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Navbar: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const toggleBurgerMenu = () => setIsBurgerOpen(!isBurgerOpen);

  return currentUser ? (
    <>
      <button
        type="button"
        onClick={toggleBurgerMenu}
        className={` h-12 w-12 md:hidden fixed top-9 right-5 transition-all duration-300 z-[100] rounded-full justify-center items-center bg-[#5F7A7A] shadow-sm hover:shadow-lightYellow hover:-translate-y-1 ${
          isBurgerOpen ? "opacity-0" : "border border-gray-700 opacity-100"
        }`}
      >
        <img src="/auth.svg" alt="Menu" className="h-12 w-12 object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        <span className="sr-only">Toggle Menu</span>
      </button>
      {isBurgerOpen && (
        <div
          onClick={toggleBurgerMenu}
          className="bg-black/40 h-screen w-screen fixed top-0 left-0 transition-opacity duration-300 z-[100]"
        />
      )}
      <nav
        className={`border-r border-opacity-30 border-gray-700 fixed md:sticky md:translate-x-0 top-0 h-dvh max-w-44 md:max-w-16 lg:max-w-20 flex flex-col items-center justify-between text-[var(--color-primary)] bg-[#5F7A7A] p-5 shadow-sm dark:bg-gray-950 transition-all duration-300 z-[100] ${
          isBurgerOpen ? "translate-x-0" : "-translate-x-44"
        }`}
      >
        <Link to="/" className="flex items-center justify-center w-20">
          <img src="/auth.svg" alt="Tribbit" className="h-14 w-14 flex-shrink-0" />
          <span className="sr-only text-[var(--color-primary)]">Tribbit</span>
        </Link>
        <Navigation />
        <UserActions />
      </nav>
    </>
  ) : null;
};

export default Navbar;
